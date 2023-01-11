import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isColdTransferEnabled, isMultiParticipantEnabled } from "../../index";
import { registerCustomChatTransferAction } from "../../custom-action/chatTransferTask";
import { registerLeaveChatAction } from "../../custom-action/leaveChat";
import { registerRemoveChatParticipant } from "../../custom-action/removeChatParticipant";
import { registerCancelChatParticipantInvite } from "../../custom-action/cancelChatParticipantInvite";

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  const coldTransferEnabled = isColdTransferEnabled();
  const multiParticipantEnabled = isMultiParticipantEnabled();

  if (!(coldTransferEnabled || multiParticipantEnabled)) return;

  console.log(
    `Feature enabled: conversation-transfer cold_transfer=${coldTransferEnabled} multi_participant=${multiParticipantEnabled}`
  );
  registerCustomChatTransferAction();
  registerLeaveChatAction();
  registerRemoveChatParticipant();
  registerCancelChatParticipantInvite();
};

export default pluginsLoadedHandler;
