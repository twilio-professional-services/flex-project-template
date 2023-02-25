import * as Flex from "@twilio/flex-ui";

export const chatOrchestratorHook = (flex: typeof Flex, manager: Flex.Manager) => ({
  event: 'completed',
  handler: handleChatComplete
})

const handleChatComplete = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData
  if (chatTransferData) return [Flex.ChatOrchestratorEvent.LeaveConversation]
  else return [Flex.ChatOrchestratorEvent.DeactivateConversation, Flex.ChatOrchestratorEvent.LeaveConversation];
}
