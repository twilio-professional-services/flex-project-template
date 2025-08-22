import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import {
  getCallbackUrl,
  isNotifyAbsentEnabled,
  isNotifyCompletedEnabled,
  isNotifyInProgressEnabled,
} from '../../config';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function setRecordingStatusCallback(flex: typeof Flex) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!payload.task || !Flex.TaskHelper.isCallTask(payload.task)) {
      return;
    }

    const callbackUrl = getCallbackUrl(payload.task);
    if (callbackUrl) {
      logger.info(
        `[recording-status-callback] Setting recordingStatusCallback for ${payload.task.sid}: ${callbackUrl}`,
      );
      if (!payload.conferenceOptions) {
        payload.conferenceOptions = {};
      }

      const events: string[] = [];
      if (isNotifyInProgressEnabled()) events.push('in-progress');
      if (isNotifyCompletedEnabled()) events.push('completed');
      if (isNotifyAbsentEnabled()) events.push('absent');
      if (events.length > 0) {
        payload.conferenceOptions.recordingStatusCallbackEvent = events.join(' ');
      }
      payload.conferenceOptions.conferenceRecordingStatusCallback = callbackUrl;
      payload.conferenceOptions.conferenceRecordingStatusCallbackMethod = 'POST';
    }
  });
};
