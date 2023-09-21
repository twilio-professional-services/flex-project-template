import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import {
  getConferenceSidFromTask,
  getLocalParticipantForTask,
  isWorkerUsingWebRTC,
} from '../../helpers/CallControlHelper';
import CallControlService from '../../helpers/CallControlService';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.HangupCall;
export const actionHook = function handleSipHangup(flex: typeof Flex, _manager: Flex.Manager) {
  if (isWorkerUsingWebRTC()) {
    console.info('SIP Support - Worker is using WebRTC, hangup hook NOT enabled', 'background: purple; color: white;');
    return;
  }

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { conference } = payload.task;

    if (!payload.task) {
      console.log('SIP Support ERROR: No task found', 'background: red; color: white;');
      return;
    }

    console.log('*** SIP Support - Payload Task', payload.task);

    // Get the worker participant SID
    const workerCallSid = getLocalParticipantForTask(payload.task);
    if (!workerCallSid) {
      console.error(`No Worker Participant SID found in task`, payload.task);
      return;
    }

    // Ensure we have a conference
    const conferenceSid = getConferenceSidFromTask(payload.task);
    if (!conferenceSid) {
      console.error(`SIP Support ERROR: No Conference SID`, payload.task);
      return;
    }

    // Hangup worker leg
    await CallControlService.removeParticipant(conferenceSid, workerCallSid);
    console.log('SIP Support - HangUp for worker leg completed');
  });
};
