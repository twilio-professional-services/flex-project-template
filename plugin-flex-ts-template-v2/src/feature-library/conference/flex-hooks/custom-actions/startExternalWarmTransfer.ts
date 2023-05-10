import { Actions, ITask, Manager, Notifications, TaskHelper } from '@twilio/flex-ui';

import ConferenceService from '../../utils/ConferenceService';
import { addConnectingParticipant } from '../states/ConferenceSlice';
import { ConferenceNotification } from '../notifications/Conference';

export const registerStartExternalWarmTransfer = async () => {
  Actions.registerAction(
    'StartExternalWarmTransfer',
    async (payload: { task?: ITask; sid?: string; phoneNumber: string; callerId: string }) => {
      // eslint-disable-next-line prefer-const
      let { task, sid, phoneNumber, callerId } = payload;
      if (!task) {
        task = TaskHelper.getTaskByTaskSid(sid || '');
      }

      if (!task) {
        console.error('Cannot start warm transfer without either a task or a valid task sid');
        return;
      }

      let mainConferenceSid = task.attributes.conference ? task.attributes.conference.sid : null;

      if (!mainConferenceSid && task.conference) {
        mainConferenceSid = task.conference.conferenceSid;
      }

      // Adding entered number to the conference
      console.log(`Adding ${phoneNumber} to conference`);
      let participantCallSid;
      try {
        participantCallSid = await ConferenceService.addParticipant(mainConferenceSid, callerId, phoneNumber);

        Manager.getInstance().store.dispatch(
          addConnectingParticipant({
            callSid: participantCallSid,
            conferenceSid: mainConferenceSid,
            phoneNumber,
          }),
        );
      } catch (error: any) {
        if (error.twilioErrorCode === 13223)
          Notifications.showNotification(ConferenceNotification.ExternalWarmTransferInvalidPhoneNumber, {
            message: error.message,
          });
        console.error('Error adding conference participant:', error);
      }
    },
  );
};
