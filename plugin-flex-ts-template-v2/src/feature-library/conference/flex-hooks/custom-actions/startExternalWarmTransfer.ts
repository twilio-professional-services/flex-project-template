import { Actions, ITask, Manager, Notifications, TaskHelper } from '@twilio/flex-ui';

import ProgrammableVoiceService from '../../../../utils/serverless/ProgrammableVoice/ProgrammableVoiceService';
import { addConnectingParticipant } from '../states/ConferenceSlice';
import { ConferenceNotification } from '../notifications/Conference';
import logger from '../../../../utils/logger';

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
        logger.error('[conference] Cannot start warm transfer without either a task or a valid task sid');
        return;
      }

      let mainConferenceSid = task.attributes.conference ? task.attributes.conference.sid : null;

      if (!mainConferenceSid && task.conference) {
        mainConferenceSid = task.conference.conferenceSid;
      }

      // Adding entered number to the conference
      logger.info(`[conference] Adding ${phoneNumber} to conference`);
      let participantCallSid;
      try {
        participantCallSid = await ProgrammableVoiceService.addParticipant(mainConferenceSid, callerId, phoneNumber);

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
        logger.error('[conference] Error adding conference participant:', error);
      }
    },
  );
};
