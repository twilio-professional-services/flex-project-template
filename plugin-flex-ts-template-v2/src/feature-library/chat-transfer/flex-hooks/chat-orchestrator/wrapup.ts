import * as Flex from '@twilio/flex-ui';

import { FlexOrchestrationEvent } from '../../../../types/feature-loader';

const handleChatWrapup = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData;
  if (chatTransferData) return [];
  return [Flex.ChatOrchestratorEvent.DeactivateConversation];
};

export const chatOrchestratorHook = (_flex: typeof Flex, _manager: Flex.Manager) => ({
  event: FlexOrchestrationEvent.wrapup,
  handler: handleChatWrapup,
});
