import * as Flex from '@twilio/flex-ui';

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
}

function examineInboundTask(flex: typeof Flex, manager: Flex.Manager) {
    const workerChanneslMap = manager.workerClient.channels;
    const tasksMap = manager.store.getState().worker.tasks;

    const workerChannelsArray = Array.from(workerChanneslMap);
    const chatChannel: any = workerChannelsArray.find((channel: any) => channel?.taskChannelUniqueName === 'chat');
    const currentChatCapacity = chatChannel?.capacity;

    const tasksArray = Array.from(tasksMap);
    const chatTasksArray = tasksArray.filter((task: any) => task.taskChannelUniqueName === 'chat');

    if (currentChatCapacity === 1) {
        // we're assuming chat capacity has been artificially reduced
        // reset it to the desired max value
    }

    if (chatTasksArray.length > 1 && chatTasksArray.length === currentChatCapacity) {
        // we're saturated
        // reduce capacity on chat channel to 1
    }

    return;
}