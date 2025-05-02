import { Actions, ITask, Notifications, TaskHelper, templates } from '@twilio/flex-ui';

import { shouldSkipPhoneNumberValidation } from '../../config';
import PhoneNumberService from '../../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import { CustomTransferDirectoryNotification } from '../notifications/CustomTransferDirectory';
import { StringTemplates } from '../strings/CustomTransferDirectory';
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
        try {
          const validationCheck = await PhoneNumberService.validatePhoneNumber(phoneNumber);

          if (!validationCheck.success) {
            Notifications.showNotification(
              CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckRequest,
              {
                phoneNumber,
              },
            );
            return;
          } else if (validationCheck.success && !validationCheck.valid) {
            let errors = validationCheck.invalidReason;

            errors = errors?.replace('COUNTRY_DISABLED', templates[StringTemplates.CountryDisabled]());
            errors = errors?.replace('COUNTRY_UNKNOWN', templates[StringTemplates.CountryUnknown]());
            errors = errors?.replace(
              'HIGH_RISK_SPECIAL_NUMBER_DISABLED',
              templates[StringTemplates.HighRiskSpecialNumberDisabled](),
            );

            Notifications.showNotification(
              CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckWithErrors,
              {
                phoneNumber,
                errors,
              },
            );
            return;
          }
        } catch (e: any) {
          logger.error('[custom-transfer-directory] Unable to validate phone number', e);
          Notifications.showNotification(CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckRequest, {
            phoneNumber,
          });
          return;
        }
      }

      try {
        await ProgrammableVoiceService.startColdTransfer(
          task?.attributes?.conference?.participants?.customer ?? task?.attributes?.call_sid,
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
