import * as Flex from '@twilio/flex-ui';
import { ParticipantTypes } from '@twilio/flex-ui/src/state/Participants/participants.types';

import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';
import { isWorkerUsingWebRTC } from '../../helpers/CallControlHelper';
import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.StopMonitoringCall;
export const actionHook = function handleSipStopMonitoring(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (isWorkerUsingWebRTC()) {
      logger.info('[sip-support] Worker is using WebRTC, skipping StopMonitoringCall hook');
      return;
    }
    if (!payload.task) {
      logger.error('[sip-support] No task found');
      return;
    }
    const conference = (payload.task as Flex.ITask).conference;
    const conferenceSid = conference?.conferenceSid;
    const myWorkerSID = manager.store.getState().flex?.worker?.worker?.sid || '';
    if (!conferenceSid || !myWorkerSID) {
      logger.error('[sip-support] No conference or worker SID found');
      return;
    }

    // Checking the conference within the task for a participant with the value "supervisor",
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor,
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid
    // which we pull from mapStateToProps at the bottom of this js file
    const supervisorParticipant = conference?.source.channelParticipants.find(
      (p) =>
        p.type === ('supervisor' as ParticipantTypes) &&
        p.mediaProperties.status === 'joined' &&
        myWorkerSID === p.routingProperties.workerSid,
    );
    const participantSid = supervisorParticipant?.participantSid;

    // If the supervisorParticipant.key is null return, this would be rare and best practice to include this
    // before calling any function you do not want to send it null values unless your function is expecting that
    if (!supervisorParticipant || !participantSid) {
      logger.error('[sip-support] No supervisor participant found');
      return;
    }

    // Hangup worker leg
    await ProgrammableVoiceService.removeParticipant(conferenceSid, participantSid);
    logger.info('[sip-support] HangUp for monitoring leg completed');
  });
};
