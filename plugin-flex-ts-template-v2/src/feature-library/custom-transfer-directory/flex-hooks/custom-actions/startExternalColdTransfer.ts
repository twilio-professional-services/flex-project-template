import { Actions, ITask, Notifications, TaskHelper } from '@twilio/flex-ui';

import { shouldSkipPhoneNumberValidation } from '../../config';
import PhoneNumberService from '../../../../utils/serverless/PhoneNumbers/PhoneNumberService';
import CustomTransferDirectoryService from '../../utils/CustomTransferDirectoryService';
import { CustomTransferDirectoryNotification } from '../notifications/CustomTransferDirectory';

export const registerStartExternalColdTransfer = async () => {
  Actions.registerAction(
    'StartExternalColdTransfer',
    async (payload: { task?: ITask; sid?: string; phoneNumber: string }) => {
      // eslint-disable-next-line prefer-const
      let { task, sid, phoneNumber } = payload;
      if (!task) {
        task = TaskHelper.getTaskByTaskSid(sid || '');
      }

      if (!task) {
        console.error('Cannot start cold transfer without either a task or a valid task sid');
        return;
      }

      if (!shouldSkipPhoneNumberValidation()) {
        const validationCheck = await PhoneNumberService.validatePhoneNumber(phoneNumber);

        if (!validationCheck.success) {
          Notifications.showNotification(CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckRequest);
          return;
        } else if (validationCheck.success && !validationCheck.lookupResponse?.valid) {
          const errors = validationCheck.lookupResponse.validationErrors.join(', ');
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

      CustomTransferDirectoryService.startColdTransfer(task.attributes.call_sid, phoneNumber);
    },
  );
};
