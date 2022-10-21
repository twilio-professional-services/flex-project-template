import { ITask, Manager, Notifications } from "@twilio/flex-ui";
import RecordingService from "../../../utils/serverless/Recording/RecordingService";
import { UIAttributes } from "../../../types/manager/ServiceConfiguration";
import { NotificationIds } from "../flex-hooks/notifications/PauseRecording";

const manager = Manager.getInstance();

const { custom_data } =
  (manager.serviceConfiguration
    .ui_attributes as UIAttributes) || {};
const { enabled: dualChannelEnabled = false, channel } =
  custom_data?.features?.dual_channel_recording || {};
  const { includeSilence = false } =
    custom_data?.features?.pause_recording || {};

export type PausedRecording = {
  reservationSid: string;
  recordingSid: string;
}

export var pausedRecordings = [] as Array<PausedRecording>;

const getDualChannelCallSid = (task: ITask): string | null => {
  const participants = task.conference?.participants;
  
  if (!participants) {
    return null;
  }
  
  let participantLeg;
  switch (channel) {
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
  
  if (!participantLeg) {
    return null;
  }
  
  return participantLeg.callSid;
}

export const pauseRecording = async (task: ITask): Promise<boolean> => {
  const recordingIndex = pausedRecordings.findIndex((pausedRecording) => pausedRecording.reservationSid === task.sid);
  
  if (recordingIndex >= 0) {
    console.error(`Recording already paused for task ${task.sid}`);
    return false;
  }
  
  try {
    let recordingSid;
    
    if (dualChannelEnabled) {
      // Dual channel records a call SID rather than a conference SID
      const callSid = getDualChannelCallSid(task);
      
      if (callSid) {
        const recording = await RecordingService.pauseCallRecording(callSid, includeSilence ? "silence" : "skip");
        recordingSid = recording.sid;
      } else {
        console.error('Unable to get call SID to pause recording');
      }
    } else if (task.conference) {
      const recording = await RecordingService.pauseConferenceRecording(task.conference?.conferenceSid, includeSilence ? "silence" : "skip");
      recordingSid = recording.sid;
    }
    
    if (recordingSid) {
      pausedRecordings.push({
        reservationSid: task.sid,
        recordingSid
      });
      Notifications.showNotification(NotificationIds.RECORDING_PAUSED);
      return true;
    }
  } catch (error) {
    console.error('Failed to pause recording', error);
  }
  
  Notifications.showNotification(NotificationIds.PAUSE_FAILED);
  return false;
}

export const resumeRecording = async (task: ITask): Promise<boolean> => {
  const recordingIndex = pausedRecordings.findIndex((pausedRecording) => pausedRecording.reservationSid === task.sid);
  
  if (recordingIndex < 0) {
    console.error(`Unable to find paused recording details for task ${task.sid}`);
    return false;
  }
  
  const recording = pausedRecordings[recordingIndex];
  
  try {
    let success = false;
    if (dualChannelEnabled) {
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
      pausedRecordings.splice(recordingIndex, 1);
      Notifications.showNotification(NotificationIds.RESUME_RECORDING);
      return true;
    }
  } catch (error) {
    console.error('Unable to resume recording', error);
  }
  
  Notifications.showNotification(NotificationIds.RESUME_FAILED);
  return false;
}