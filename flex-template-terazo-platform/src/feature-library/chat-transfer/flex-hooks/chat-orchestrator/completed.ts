import * as Flex from '@twilio/flex-ui';

import { FlexOrchestrationEvent } from '../../../../types/feature-loader';

const handleChatComplete = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData;
  if (chatTransferData) return [Flex.ChatOrchestratorEvent.LeaveConversation];
  return [Flex.ChatOrchestratorEvent.DeactivateConversation, Flex.ChatOrchestratorEvent.LeaveConversation];
};

export const chatOrchestratorHook = (_flex: typeof Flex, _manager: Flex.Manager) => ({
  event: FlexOrchestrationEvent.completed,
  handler: handleChatComplete,
});
