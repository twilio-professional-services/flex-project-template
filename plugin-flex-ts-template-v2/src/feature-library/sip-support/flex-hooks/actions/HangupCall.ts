import * as Flex from '@twilio/flex-ui';

import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';
import {
  getConferenceSidFromTask,
  getLocalParticipantForTask,
  isWorkerUsingWebRTC,
} from '../../helpers/CallControlHelper';
import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.replace;
export const actionName = FlexAction.HangupCall;
export const actionHook = function handleSipHangup(flex: typeof Flex, _manager: Flex.Manager) {
  if (isWorkerUsingWebRTC()) {
    logger.info('[sip-support] Worker is using WebRTC, hangup hook NOT enabled');
    return;
  }

  flex.Actions.replaceAction(FlexAction.HangupCall, async (payload, original) => {
    if (!payload.task) {
      logger.error('[sip-support] No task found, calling original action');
      original(payload);
      return;
    }

    // Get the worker participant SID
    const workerCallSid = getLocalParticipantForTask(payload.task);
    if (!workerCallSid) {
      logger.error(`[sip-support] No Worker Participant SID found in task`, payload.task);
      return;
    }

    // Ensure we have a conference
    const conferenceSid = getConferenceSidFromTask(payload.task);
    if (!conferenceSid) {
      logger.error(`[sip-support] No Conference SID`, payload.task);
      return;
    }

    // Hangup worker leg
    await ProgrammableVoiceService.removeParticipant(conferenceSid, workerCallSid);
    logger.info('[sip-support] HangUp for worker leg completed');
  });
};
