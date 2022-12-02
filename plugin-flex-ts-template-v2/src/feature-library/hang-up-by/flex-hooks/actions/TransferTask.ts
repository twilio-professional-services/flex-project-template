import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from "../..";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';

export function reportHangUpByTransferTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeTransferTask', async (payload, abortFunction) => {
    HangUpByHelper.setHangUpBy(payload.sid, payload.options.mode === "COLD" ? HangUpBy.ColdTransfer : HangUpBy.WarmTransfer);
  });
}
