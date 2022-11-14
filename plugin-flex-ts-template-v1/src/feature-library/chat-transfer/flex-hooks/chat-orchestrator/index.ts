import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if(!enabled) return;
  
  flex.ChatOrchestrator.setOrchestrations('wrapup', handleChatWrapup);
  flex.ChatOrchestrator.setOrchestrations('completed', handleChatComplete);
}

const handleChatWrapup = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData
  if (chatTransferData) return []
  else return [Flex.ChatOrchestratorEvent.DeactivateChatChannel];
}

const handleChatComplete = (task: Flex.ITask): any => {
  const chatTransferData = task.attributes?.chatTransferData
  if (chatTransferData) return [Flex.ChatOrchestratorEvent.LeaveChatChannel]
  else return [Flex.ChatOrchestratorEvent.DeactivateChatChannel, Flex.ChatOrchestratorEvent.LeaveChatChannel];
}

