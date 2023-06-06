import * as Flex from '@twilio/flex-ui';

import { Channel } from '../../../../types/task-router';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { getConfigChannel, getDefaultMaxCapacity } from '../../config';

const STORAGE_KEY = 'omni_channel_previous_capacity';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.AcceptTask;

/*
  this function manages channel capacity for chat and is intended to be used in
  an omni channel solution.

  Specifically where we want to inhibit tasks of different channels 
  being delivered to an agent.
  
  There is a dependency on the workflow expression inhibiting creating 
  reservations for tasks if an agent has work on an existing channel.
    
  example workflow expressions
    workflow matching chat tasks to workers that dont have voice tasks
      - worker.channel.voice.available_capacity_percentage == 100
    workflow matching voice tasks to workers that dont have chats
      - worker.channel.chat.available_capacity_percentage == 100

  In the case of chat for example, if voice has a capacity of 1 and chat has a
  capacity of 2, this means if there is a backlog of chat work, the agent would
  be locked into doing that chat work as each time a chat task is dismissed, 
  another chat task would take its place.  This means that the chat backlog would
  need to be exhausted before the user would ever qualify for voice work.

  this function works such that when reaching the chat capacity, it can be assumed
  there is a backlog of chat work, therefore the capacity is reduced to 1 allowing 
  the agent to complete all the work for the chat channel and for task router to 
  assign the next piece of work of highest importance across any channel.

  Once the next piece of work is received, the capacity is reset. 
*/
export const actionHook = function omniChannelChatCapacityManager(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async () => {
    const workerChanneslMap = manager?.workerClient?.channels;
    const tasksMap = manager.store.getState().flex.worker.tasks;
    const channelFromConfig = getConfigChannel();

    const workerChannelsArray = workerChanneslMap ? Array.from(workerChanneslMap.values()) : null;
    const configuredChannel: Channel | undefined = workerChannelsArray
      ? workerChannelsArray.find((channel) => {
          return channel?.taskChannelUniqueName === channelFromConfig;
        })
      : undefined;

    if (!configuredChannel) {
      return;
    }

    const currentChannelCapacity = configuredChannel.capacity;
    const workerChannelSid = configuredChannel.sid;

    const tasksArray = Array.from(tasksMap.values());
    const channelTasks: Array<any>[] | any = tasksArray.filter((task: any) => {
      return task.taskChannelUniqueName === channelFromConfig;
    });

    const workerSid = manager?.workerClient?.sid || '';

    if (workerSid && currentChannelCapacity === 1) {
      // we're assuming channel capacity has been artificially reduced
      // reset it to the desired max value
      const storageValue = Number(localStorage.getItem(STORAGE_KEY));
      let maxCapacity = getDefaultMaxCapacity();

      if (!isNaN(storageValue) && storageValue > 0) {
        maxCapacity = storageValue;
      }

      if (channelTasks.length < maxCapacity) {
        TaskRouterService.updateWorkerChannel(workerSid, workerChannelSid, maxCapacity, true);
      }
    }

    if (workerSid && channelTasks.length > 1 && channelTasks.length === currentChannelCapacity) {
      // we're saturated
      // reduce capacity on channel to 1
      localStorage.setItem(STORAGE_KEY, currentChannelCapacity.toString());
      TaskRouterService.updateWorkerChannel(workerSid, workerChannelSid, 1, true);
    }
  });
};
