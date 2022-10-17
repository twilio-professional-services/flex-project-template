import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isColdTransferEnabled, isMultiParticipantEnabled } from "../../index";
import { registerCustomChatTransferAction } from "../../custom-action/chatTransferTask";

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  const coldTransferEnabled = isColdTransferEnabled();
  const multiParticipantEnabled = isMultiParticipantEnabled();

  if (!(coldTransferEnabled || multiParticipantEnabled)) return;

  console.log(
    `Feature enabled: chat-transfer cold_transfer=${coldTransferEnabled} multi_participant=${multiParticipantEnabled}`
  );
  registerCustomChatTransferAction();
};

export default pluginsLoadedHandler;
