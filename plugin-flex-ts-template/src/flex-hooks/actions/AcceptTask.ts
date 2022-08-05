import * as Flex from '@twilio/flex-ui';
import { Channel } from 'types/task-router';
import TaskRouterService from '../../utils/serverless/TaskRouter/TaskRouterService';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  //beforeAcceptTask(flex, manager);
  //replaceAcceptTask(flex, manager);
  afterAcceptTask(flex, manager);
}

function beforeAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
}

// Avoid using replace hook if possible
function replaceAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  omniChannelChatCapacityManager(flex, manager);
}

function omniChannelChatCapacityManager(flex: typeof Flex, manager: Flex.Manager) {
  
  Flex.Actions.addListener('afterAcceptTask', async (payload, abortFunction) => {
    const workerChanneslMap = manager.workerClient.channels;
    const tasksMap = manager.store.getState().flex.worker.tasks;

    const workerChannelsArray = Array.from(workerChanneslMap);
    const chatChannelArrayItem = workerChannelsArray.find(([string, channel]) => {
      return channel?.taskChannelUniqueName === 'chat'});
    const chatChannel = chatChannelArrayItem? chatChannelArrayItem[1] as Channel : null
    
    console.log("JARED1", chatChannel);
    if(chatChannel) {
      const currentChatCapacity = chatChannel.capacity;
      const workerChannelSid = chatChannel.sid;

      const tasksArray = Array.from(tasksMap);
      const chatTasksArray = tasksArray.filter((array: any) => array[1].taskChannelUniqueName === 'chat');

      console.log("JARED 1.5", tasksArray, chatTasksArray, currentChatCapacity);

      const workerSid = manager.workerClient.sid;

      if (currentChatCapacity === 1) {
        console.log("JARED2");
          // we're assuming chat capacity has been artificially reduced
          // reset it to the desired max value
          TaskRouterService.updateWorkerChannel(workerSid, workerChannelSid, 2, true);
      }

      if (chatTasksArray.length > 1 && chatTasksArray.length === currentChatCapacity) {
        console.log("JARED3");
          // we're saturated
          // reduce capacity on chat channel to 1
          TaskRouterService.updateWorkerChannel(workerSid, workerChannelSid, 1, true);
      }
    }

    return;
  })
}
