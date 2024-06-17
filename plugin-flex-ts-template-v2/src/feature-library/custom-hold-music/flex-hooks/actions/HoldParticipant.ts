import * as Flex from '@twilio/flex-ui';

import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import { getHoldMusicUrl } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.HoldParticipant;
export const actionHook = function setHoldMusicBeforeHoldParticipant(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    payload.holdMusicUrl = getHoldMusicUrl();

    if (!payload.targetSid || !payload.task) {
      return;
    }

    // Override hold handling for participants from the native XWT functionality due to Flex ignoring payload.holdMusicUrl: SEFLEX-3875
    // Find the full participant object based on the targetSid
    const participant = payload?.task?.conference?.participants?.find(
      (p: any) => payload.targetSid === (payload.targetSid.startsWith('UT') ? p.participantSid : p.callSid),
    );

    // Only Native XWT participants are of the 'external' type, ignore if this participant is something else
    if (!participant || participant.participantType !== 'external') {
      return;
    }

    const conferenceSid = payload.task.conference?.conferenceSid || payload.task.attributes?.conference?.sid;
    abortFunction();
    logger.info(`[custom-hold-music] Holding participant ${participant.callSid}`);
    await ProgrammableVoiceService.holdParticipant(conferenceSid, participant.callSid);
  });
};
