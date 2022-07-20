import * as Flex from '@twilio/flex-ui';

export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

// Note the wrapup task event only fires for chat tasks
// Action events represent agent actions and voice tasks can
// be pushed into wrapup by the customer hanging up.

export default (flex: typeof Flex, manager: Flex.Manager) => {
  //beforeWrapupTask(flex, manager);
  //afterWrapupTask(flex, manager);
}

function beforeWrapupTask(flex: typeof Flex, manager: Flex.Manager) {
}

// Avoid using replace hook if possible
function replaceWrapupTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterWrapupTask(flex: typeof Flex, manager: Flex.Manager) {
}
