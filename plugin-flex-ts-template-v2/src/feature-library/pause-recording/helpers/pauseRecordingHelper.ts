import { ITask, Manager, Notifications } from '@twilio/flex-ui';

import PauseRecordingService from './PauseRecordingService';
import { NotificationIds } from '../flex-hooks/notifications/PauseRecording';
import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { PauseRecordingState, pause, resume } from '../flex-hooks/states/PauseRecordingSlice';
import { isBannerIndicatorEnabled, isIncludeSilenceEnabled, isDualChannelEnabled, getChannelToRecord } from '../config';
import logger from '../../../utils/logger';

const manager = Manager.getInstance();
const isSingleChannelRecEnabled = manager.serviceConfiguration.call_recording_enabled;

const getDualChannelCallSid = (task: ITask): string | null => {
  const participants = task.conference?.participants;

  if (!participants) {
    return null;
  }

  let participantLeg;
  switch (getChannelToRecord()) {
    case 'customer': {
      participantLeg = participants.find((p) => p.participantType === 'customer');
      break;
    }
    case 'worker': {
      participantLeg = participants.find(
        (p) => p.participantType === 'worker' && p.isCurrentWorker && p.status === 'joined',
      );
      break;
    }
    default:
      break;
  }

  if (!participantLeg || !participantLeg.callSid) {
    return null;
  }

  return participantLeg.callSid;
};

export const pauseRecording = async (task: ITask): Promise<boolean> => {
  const state = manager.store.getState() as AppState;
  const recordingIndex = (state[reduxNamespace].pauseRecording as PauseRecordingState).pausedRecordings.findIndex(
    (pausedRecording) => pausedRecording.reservationSid === task.sid,
  );

  if (recordingIndex >= 0) {
    logger.error(`[pause-recording] Recording already paused for task ${task.sid}`);
    return false;
  }

  try {
    let recordingSidDC = '';
    let recordingSidSC = '';
    let isMissingRecording = false;

    if (isDualChannelEnabled()) {
      // Dual channel records a call SID rather than a conference SID
      const callSid = getDualChannelCallSid(task);

      if (callSid) {
        logger.info('[pause-recording] Pausing dual channel recording');
        try {
          const recording = await PauseRecordingService.pauseCallRecording(
            callSid,
            isIncludeSilenceEnabled() ? 'silence' : 'skip',
          );
          recordingSidDC = recording.sid;
        } catch (error: any) {
          if (error.twilioErrorCode === 21220) {
            isMissingRecording = true;
            logger.warn('[pause-recording] Missing dual channel recording');
          } else {
            logger.error('[pause-recording] Unable to pause dual channel recording', error);
          }
        }
      } else {
        logger.error('[pause-recording] Unable to get call SID to pause dual channel recording');
      }
    }

    if (isSingleChannelRecEnabled && task.conference) {
      logger.info('[pause-recording] Pausing single channel recording');
      try {
        const recording = await PauseRecordingService.pauseConferenceRecording(
          task.conference?.conferenceSid,
          isIncludeSilenceEnabled() ? 'silence' : 'skip',
        );
        recordingSidSC = recording.sid;
      } catch (error: any) {
        if (error.twilioErrorCode === 21220) {
          isMissingRecording = true;
          logger.warn('[pause-recording] Missing single channel recording');
        } else {
          logger.error('[pause-recording] Unable to pause single channel recording', error);
        }
      }
    }

    if (recordingSidSC || recordingSidDC) {
      manager.store.dispatch(
        pause({
          reservationSid: task.sid,
          recordingSidDC,
          recordingSidSC,
        }),
      );
      if (isBannerIndicatorEnabled()) Notifications.showNotification(NotificationIds.RECORDING_PAUSED);
      return true;
    } else if (isMissingRecording || (!isSingleChannelRecEnabled && !isDualChannelEnabled())) {
      // We didn't fail, there was simply no recording to pause
      Notifications.showNotification(NotificationIds.MISSING_RECORDING);
      return false;
    }
  } catch (error: any) {
    logger.error('[pause-recording] Failed to pause recording', error);
  }

  Notifications.showNotification(NotificationIds.PAUSE_FAILED);
  return false;
};

export const resumeRecording = async (task: ITask): Promise<boolean> => {
  const state = manager.store.getState() as AppState;
  const recordingIndex = (state[reduxNamespace].pauseRecording as PauseRecordingState).pausedRecordings.findIndex(
    (pausedRecording) => pausedRecording.reservationSid === task.sid,
  );

  if (recordingIndex < 0) {
    logger.error(`[pause-recording] Unable to find paused recording details for task ${task.sid}`);
    return false;
  }

  const recording = state[reduxNamespace].pauseRecording.pausedRecordings[recordingIndex];

  try {
    let success = false;
    if (recording?.recordingSidDC) {
      // Dual channel records a call SID rather than a conference SID
      const callSid = getDualChannelCallSid(task);

      if (callSid) {
        logger.info('[pause-recording] Resuming dual channel recording');
        try {
          await PauseRecordingService.resumeCallRecording(callSid, recording.recordingSidDC);
          success = true;
        } catch (error: any) {
          logger.error('[pause-recording] Unable to resume dual channel recording', error);
        }
      } else {
        logger.error('[pause-recording] Unable to get call SID to resume dual channel recording');
      }
    }

    if (task.conference && recording?.recordingSidSC) {
      logger.info('[pause-recording] Resuming single channel recording');
      try {
        await PauseRecordingService.resumeConferenceRecording(task.conference?.conferenceSid, recording.recordingSidSC);
        success = true;
      } catch (error: any) {
        logger.error('[pause-recording] Unable to resume single channel recording', error);
      }
    }

    if (success) {
      manager.store.dispatch(resume(recordingIndex));
      if (isBannerIndicatorEnabled()) Notifications.showNotification(NotificationIds.RESUME_RECORDING);
      return true;
    }
  } catch (error: any) {
    logger.error('[pause-recording] Unable to resume recording', error);
  }

  Notifications.showNotification(NotificationIds.RESUME_FAILED);
  return false;
};
