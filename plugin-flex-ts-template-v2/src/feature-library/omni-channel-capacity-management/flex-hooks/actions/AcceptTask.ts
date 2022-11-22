import * as Flex from "@twilio/flex-ui";
import { Channel } from "../../../../types/task-router";
import TaskRouterService from "../../../../utils/serverless/TaskRouter/TaskRouterService";
import { isFeatureEnabled } from '../..';

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
  assign the next peice of work of highest importance across any channel.

  Once the next piece of work is recieved, the capacity is reset. 
*/
export function omniChannelChatCapacityManager(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isFeatureEnabled()) return;

  Flex.Actions.addListener("afterAcceptTask", async () => {
    const workerChanneslMap = manager?.workerClient?.channels;
    const tasksMap = manager.store.getState().flex.worker.tasks;

    const workerChannelsArray = workerChanneslMap
      ? Array.from(workerChanneslMap.values())
      : null;
    const chatChannel: Channel | undefined = workerChannelsArray
      ? workerChannelsArray.find((channel) => {
          return channel?.taskChannelUniqueName === "chat";
        })
      : undefined;

    if (!chatChannel) {
      return;
    }

    const currentChatCapacity = chatChannel.capacity; // current assumed to be 2
    const workerChannelSid = chatChannel.sid;

    const tasksArray = Array.from(tasksMap.values());
    const chatTasks: Array<any>[] | any = tasksArray.filter((task: any) => {
      return task.taskChannelUniqueName === "chat";
    });

    const workerSid = manager?.workerClient?.sid || "";

    if (workerSid && currentChatCapacity === 1 && chatTasks.length < 2) {
      // we're assuming chat capacity has been artificially reduced
      // reset it to the desired max value
      /* 
          TODO: - add logic to derive max capacity instead of hard coded 2
        */
      TaskRouterService.updateWorkerChannel(
        workerSid,
        workerChannelSid,
        2,
        true
      );
    }

    if (
      workerSid &&
      chatTasks.length > 1 &&
      chatTasks.length === currentChatCapacity
    ) {
      // we're saturated
      // reduce capacity on chat channel to 1
      TaskRouterService.updateWorkerChannel(
        workerSid,
        workerChannelSid,
        1,
        true
      );
    }
  });
}
