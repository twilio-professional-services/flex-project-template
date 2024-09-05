import * as Flex from '@twilio/flex-ui';

import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';
import {
  getConferenceSidFromTask,
  getLocalParticipantForTask,
  isWorkerUsingWebRTC,
} from '../../helpers/CallControlHelper';
import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import logger from '../../../../utils/logger';
import { validateUiVersion } from '../../../../utils/configuration';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.WrapupTask;
export const actionHook = function handleSipWrapup(flex: typeof Flex) {
  if (validateUiVersion('< 2.7')) {
    // Flex UI earlier than 2.7 calls HangupCall instead, so do not install this hook on those versions.
    return;
  }

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (isWorkerUsingWebRTC()) {
      logger.info('[sip-support] Worker is using WebRTC, skipping wrapup hook');
      return;
    }

    if (!payload.task) {
      logger.error('[sip-support] No task found');
      return;
    }

    if (!Flex.TaskHelper.isCallTask(payload.task)) {
      logger.info('[sip-support] Task is not a call, skipping wrapup hook');
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
