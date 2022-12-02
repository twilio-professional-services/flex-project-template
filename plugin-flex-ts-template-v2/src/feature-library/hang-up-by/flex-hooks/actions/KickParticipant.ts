import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from "../..";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';

export function reportHangUpByKickParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeKickParticipant', async (payload, abortFunction) => {
    if (payload.participantType === "customer") {
      HangUpByHelper.setHangUpBy(payload.sid,  HangUpBy.Agent);
    }
  });
}
