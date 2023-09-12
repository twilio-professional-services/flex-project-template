import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

import CallControlService from '../../helpers/CallControlService';
import { getLocalParticipantForTask, isWorkerUsingWebRTC } from '../../helpers/CallControlHelper';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.ToggleMute;

export const actionHook = function handleToggleMuteCall(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    console.log('Running handleToggleMuteCall');

    const { participantType, targetSid: participantSid, task } = payload;

    if (participantType !== 'unknown') {
      console.log(`Participant type is unknown`);
      return;
    }
    const conferenceSid = task.conference?.conferenceSid;
    const workerParticipant = getLocalParticipantForTask(task);

    if (!workerParticipant) {
      console.error('Worker participant not found', workerParticipant);
      return;
    }

    if (!isWorkerUsingWebRTC()) {
      console.log('Running handleToggleMuteCall', payload);
      _abortFunction();
      CallControlService.muteParticipant(conferenceSid, workerParticipant.sid);
    } else {
      console.log('Call is a WebRTC call, running default ToggleMute action');
    }
  });
};
