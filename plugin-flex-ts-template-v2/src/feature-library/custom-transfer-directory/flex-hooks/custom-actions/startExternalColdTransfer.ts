import { Actions, ITask, Notifications, TaskHelper } from '@twilio/flex-ui';

import { shouldSkipPhoneNumberValidation } from '../../config';
import PhoneNumberService from '../../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import { CustomTransferDirectoryNotification } from '../notifications/CustomTransferDirectory';
import logger from '../../../../utils/logger';

export const registerStartExternalColdTransfer = async () => {
  Actions.registerAction(
    'StartExternalColdTransfer',
    async (payload: { task?: ITask; sid?: string; phoneNumber: string; callerId?: string }) => {
      // eslint-disable-next-line prefer-const
      let { task, sid, phoneNumber, callerId } = payload;
      if (!task) {
        task = TaskHelper.getTaskByTaskSid(sid || '');
      }

      if (!task) {
        logger.error(
          '[custom-transfer-directory] Cannot start cold transfer without either a task or a valid task sid',
        );
        return;
      }

      if (!shouldSkipPhoneNumberValidation()) {
        const validationCheck = await PhoneNumberService.validatePhoneNumber(phoneNumber);

        if (!validationCheck.success) {
          Notifications.showNotification(CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckRequest);
          return;
        } else if (validationCheck.success && !validationCheck.valid) {
          const errors = validationCheck.invalidReason;
          Notifications.showNotification(
            CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckWithErrors,
            {
              phoneNumber,
              errors,
            },
          );
          return;
        }
      }

      try {
        await ProgrammableVoiceService.startColdTransfer(
          task?.attributes?.call_sid ?? task.attributes.conference.participants.customer,
          phoneNumber,
          callerId,
        );
      } catch (error: any) {
        logger.error('[custom-transfer-directory] Error executing startColdTransfer', error);
        Notifications.showNotification(CustomTransferDirectoryNotification.ErrorExecutingColdTransfer, {
          message: error.message,
        });
      }
    },
  );
};
