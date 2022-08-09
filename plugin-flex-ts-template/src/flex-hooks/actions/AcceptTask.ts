import * as Flex from '@twilio/flex-ui';
import { TaskHelper } from '@twilio/flex-ui';
import { Channel, Reservation } from '../../types/task-router';
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
  autoRejectOutstandingReservationsForOpposingChannel(flex, manager);
}

function autoRejectOutstandingReservationsForOpposingChannel(flex: typeof Flex, manager: Flex.Manager){
  
  Flex.Actions.addListener('afterAcceptTask', async (payload, abortFunction) => {

    const task = payload.task || TaskHelper.getTaskByTaskSid(payload.sid);
    const acceptedTaskChannel = task.taskChannelUniqueName;

    const reservationMap = manager.workerClient.reservations;
    reservationMap.forEach((reservation) => {
      const status = reservation.status;
      const reservationChannel = reservation.task.taskChannelUniqueName;

      if(status === 'pending' && reservationChannel != acceptedTaskChannel){
          reservation.reject();
      }
    })
 
    return;
  })

}

function omniChannelChatCapacityManager(flex: typeof Flex, manager: Flex.Manager) {
  
  Flex.Actions.addListener('afterAcceptTask', async (payload, abortFunction) => {
    const workerChanneslMap = manager.workerClient.channels;
    const tasksMap = manager.store.getState().flex.worker.tasks;

    const workerChannelsArray = Array.from(workerChanneslMap.values());
    const chatChannel: Channel | undefined = workerChannelsArray.find((channel) => {
        return channel?.taskChannelUniqueName === 'chat'
    });
    
    if (!chatChannel) {
        return;
    }
      
    const currentChatCapacity = chatChannel.capacity;
    const workerChannelSid = chatChannel.sid;

    const tasksArray = tasksMap.values();
    const chatTasks: Flex.ITask[] = tasksArray.filter((task: Flex.ITask) => task.taskChannelUniqueName === 'chat');

    const workerSid = manager.workerClient.sid;

    if (currentChatCapacity === 1) {
        // we're assuming chat capacity has been artificially reduced
        // reset it to the desired max value
        TaskRouterService.updateWorkerChannel(workerSid, workerChannelSid, 2, true);
    }

    if (chatTasks.length > 1 && chatTasks.length === currentChatCapacity) {
        // we're saturated
        // reduce capacity on chat channel to 1
        TaskRouterService.updateWorkerChannel(workerSid, workerChannelSid, 1, true);
    }

    return;
  })
}
