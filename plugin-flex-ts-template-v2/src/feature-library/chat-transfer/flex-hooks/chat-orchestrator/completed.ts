import * as Flex from '@twilio/flex-ui';

import { FlexOrchestrationEvent } from '../../../../types/feature-loader';

export const chatOrchestratorHook = (flex: typeof Flex, manager: Flex.Manager) => ({
  event: FlexOrchestrationEvent.completed,
  handler: handleChatComplete,
});

const handleChatComplete = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData;
  if (chatTransferData) return [Flex.ChatOrchestratorEvent.LeaveConversation];
  return [Flex.ChatOrchestratorEvent.DeactivateConversation, Flex.ChatOrchestratorEvent.LeaveConversation];
};
