import * as Flex from "@twilio/flex-ui";
import * as HangUpByHelper from "../../helpers/hangUpBy";
import { HangUpBy } from '../../enums/hangUpBy';
import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader";

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.KickParticipant;
export const actionHook = function reportHangUpByKickParticipant(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener('beforeKickParticipant', async (payload, abortFunction) => {
    if (payload.participantType === "customer") {
      HangUpByHelper.setHangUpBy(payload.sid,  HangUpBy.Agent);
    }
  });
}
