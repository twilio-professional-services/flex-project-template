import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from '../../index';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if(!isFeatureEnabled()) return;
  
  flex.ChatOrchestrator.setOrchestrations('wrapup', handleChatWrapup);
  flex.ChatOrchestrator.setOrchestrations('completed', handleChatComplete);
}

const handleChatWrapup = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData;
  if (chatTransferData) return []
  else return [Flex.ChatOrchestratorEvent.DeactivateConversation];
}

const handleChatComplete = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData
  if (chatTransferData) return [Flex.ChatOrchestratorEvent.LeaveConversation]
  else return [Flex.ChatOrchestratorEvent.DeactivateConversation, Flex.ChatOrchestratorEvent.LeaveConversation];
}

