import * as Flex from "@twilio/flex-ui";
import { FlexOrchestrationEvent } from "../../../../types/feature-loader";

export const chatOrchestratorHook = (flex: typeof Flex, manager: Flex.Manager) => ({
  event: FlexOrchestrationEvent.wrapup,
  handler: handleChatWrapup
});

const handleChatWrapup = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData;
  if (chatTransferData) return []
  else return [Flex.ChatOrchestratorEvent.DeactivateConversation];
}
