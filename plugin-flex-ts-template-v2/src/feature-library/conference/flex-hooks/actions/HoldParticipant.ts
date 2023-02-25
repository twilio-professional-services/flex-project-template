import * as Flex from "@twilio/flex-ui";
import ConferenceService from "../../utils/ConferenceService";
import { isAddButtonEnabled } from '../..';
import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader/FlexAction";

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.HoldParticipant;
export const actionHook = function handleHoldConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!isAddButtonEnabled()) return;

  flex.Actions.addListener("beforeHoldParticipant", async (payload, abortFunction) => {
    const { participantType, targetSid: participantSid, task } = payload;
    
    if (participantType !== 'unknown') {
      return;
    }
    
    const conferenceSid = task.conference?.conferenceSid;
    abortFunction();
    console.log('Holding participant', participantSid);
    await ConferenceService.holdParticipant(conferenceSid, participantSid);
  });
}
