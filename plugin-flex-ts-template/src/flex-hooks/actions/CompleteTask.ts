import * as Flex from '@twilio/flex-ui';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  //beforeCompleteTask(flex, manager);
  //replaceCompleteTask(flex, manager);
  //afterCompleteTask(flex, manager);
}

function beforeCompleteTask(flex: typeof Flex, manager: Flex.Manager) {
}

// Avoid using replace hook if possible
function replaceCompleteTask(flex: typeof Flex, manager: Flex.Manager) {
}

function afterCompleteTask(flex: typeof Flex, manager: Flex.Manager) {
}

// Export these "private" functions so we can test each in isolation