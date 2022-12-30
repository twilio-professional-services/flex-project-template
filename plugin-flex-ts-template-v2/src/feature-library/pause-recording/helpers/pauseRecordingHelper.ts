import { ITask, Manager, Notifications } from "@twilio/flex-ui";
import RecordingService from "./RecordingService";
import { NotificationIds } from "../flex-hooks/notifications/PauseRecording";
import { AppState, reduxNamespace } from "../../../flex-hooks/states";
import { pause, resume } from "../flex-hooks/states/PauseRecordingSlice";
import { isBannerIndicatorEnabled, isIncludeSilenceEnabled } from '..';
import { isFeatureEnabled as isDualChannelEnabled, getChannelToRecord } from '../../dual-channel-recording';

const manager = Manager.getInstance();

const getDualChannelCallSid = (task: ITask): string | null => {
  const participants = task.conference?.participants;
  
  if (!participants) {
    return null;
  }
  
  let participantLeg;
  switch (getChannelToRecord()) {
    case 'customer': {
      participantLeg = participants.find(
        (p) => p.participantType === 'customer'
      );
      break;
    }
    case 'worker': {
      participantLeg = participants.find(
        (p) => p.participantType === 'worker' && p.isCurrentWorker
      );
      break;
    }
  }
  
  if (!participantLeg || !participantLeg.callSid) {
    return null;
  }
  
  return participantLeg.callSid;
}

export const pauseRecording = async (task: ITask): Promise<boolean> => {
  const state = manager.store.getState() as AppState;
  const recordingIndex = state[reduxNamespace].pauseRecording.pausedRecordings.findIndex((pausedRecording) => pausedRecording.reservationSid === task.sid);
  
  if (recordingIndex >= 0) {
    console.error(`Recording already paused for task ${task.sid}`);
    return false;
  }
  
  try {
    let recordingSid;
    
    if (isDualChannelEnabled()) {
      // Dual channel records a call SID rather than a conference SID
      const callSid = getDualChannelCallSid(task);
      
      if (callSid) {
        const recording = await RecordingService.pauseCallRecording(callSid, isIncludeSilenceEnabled() ? "silence" : "skip");
        recordingSid = recording.sid;
      } else {
        console.error('Unable to get call SID to pause recording');
      }
    } else if (task.conference) {
      const recording = await RecordingService.pauseConferenceRecording(task.conference?.conferenceSid, isIncludeSilenceEnabled() ? "silence" : "skip");
      recordingSid = recording.sid;
    }
    
    if (recordingSid) {
      manager.store.dispatch(pause({
        reservationSid: task.sid,
        recordingSid
      }));
      if (isBannerIndicatorEnabled()) Notifications.showNotification(NotificationIds.RECORDING_PAUSED);
      return true;
    }
  } catch (error) {
    console.error('Failed to pause recording', error);
  }
  
  Notifications.showNotification(NotificationIds.PAUSE_FAILED);
  return false;
}

export const resumeRecording = async (task: ITask): Promise<boolean> => {
  const state = manager.store.getState() as AppState;
  const recordingIndex = state[reduxNamespace].pauseRecording.pausedRecordings.findIndex((pausedRecording) => pausedRecording.reservationSid === task.sid);
  
  if (recordingIndex < 0) {
    console.error(`Unable to find paused recording details for task ${task.sid}`);
    return false;
  }
  
  const recording = state[reduxNamespace].pauseRecording.pausedRecordings[recordingIndex];
  
  try {
    let success = false;
    if (isDualChannelEnabled()) {
      // Dual channel records a call SID rather than a conference SID
      const callSid = getDualChannelCallSid(task);
      
      if (callSid) {
        await RecordingService.resumeCallRecording(callSid, recording.recordingSid);
        success = true;
      } else {
        console.error('Unable to get call SID to resume recording');
      }
    } else if (task.conference) {
      await RecordingService.resumeConferenceRecording(task.conference?.conferenceSid, recording.recordingSid);
      success = true;
    }
    
    if (success) {
      manager.store.dispatch(resume(recordingIndex));
      if (isBannerIndicatorEnabled()) Notifications.showNotification(NotificationIds.RESUME_RECORDING);
      return true;
    }
  } catch (error) {
    console.error('Unable to resume recording', error);
  }
  
  Notifications.showNotification(NotificationIds.RESUME_FAILED);
  return false;
}
