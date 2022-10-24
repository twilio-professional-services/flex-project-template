import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';
import { StringTemplates } from '../strings/PauseRecording';

export enum NotificationIds {
  RECORDING_PAUSED = 'PSRecordingPaused',
  RESUME_RECORDING = 'PSResumeRecording',
  PAUSE_FAILED = 'PSPauseFailed',
  RESUME_FAILED = 'PSResumeFailed',
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  flex.Notifications.registerNotification({
    id: NotificationIds.RECORDING_PAUSED,
    closeButton: true,
    content: StringTemplates.RECORDING_PAUSED,
    type: NotificationType.warning,
    timeout: 3000
  });
  flex.Notifications.registerNotification({
    id: NotificationIds.RESUME_RECORDING,
    closeButton: true,
    content: StringTemplates.RESUME_RECORDING,
    type: NotificationType.success,
    timeout: 3000
  });
  flex.Notifications.registerNotification({
    id: NotificationIds.PAUSE_FAILED,
    closeButton: true,
    content: StringTemplates.PAUSE_FAILED,
    type: NotificationType.error,
    timeout: 3000
  });
  flex.Notifications.registerNotification({
    id: NotificationIds.RESUME_FAILED,
    closeButton: true,
    content: StringTemplates.RESUME_FAILED,
    type: NotificationType.error,
    timeout: 3000
  });
};
