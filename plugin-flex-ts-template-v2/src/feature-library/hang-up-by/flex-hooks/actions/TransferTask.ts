import * as Flex from "@twilio/flex-ui";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';
import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader/FlexAction";

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.TransferTask;
export const actionHook = function reportHangUpByTransferTask(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener('beforeTransferTask', async (payload, abortFunction) => {
    HangUpByHelper.setHangUpBy(payload.sid, payload.options.mode === "COLD" ? HangUpBy.ColdTransfer : HangUpBy.WarmTransfer);
  });
}
