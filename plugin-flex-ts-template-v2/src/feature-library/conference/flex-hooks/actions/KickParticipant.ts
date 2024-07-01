import * as Flex from '@twilio/flex-ui';

import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.KickParticipant;
export const actionHook = function handleKickConferenceParticipant(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { participantType } = payload;

    if (
      participantType &&
      participantType !== 'transfer' &&
      participantType !== 'external' &&
      participantType !== 'worker'
    ) {
      abortFunction();

      const { task, targetSid } = payload;

      const conference = task.conference?.conferenceSid || task.attributes?.conference?.sid;

      const participantSid = targetSid;

      logger.info(`[conference] Removing participant ${participantSid} from conference`);
      await ProgrammableVoiceService.removeParticipant(conference, participantSid);
    }
  });
};
