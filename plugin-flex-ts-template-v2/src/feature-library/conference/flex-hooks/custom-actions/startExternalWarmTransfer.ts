import { Actions, ITask, Manager, TaskHelper } from '@twilio/flex-ui';

import ConferenceService from '../../utils/ConferenceService';
import { addConnectingParticipant } from '../states/ConferenceSlice';

export const registerStartExternalWarmTransfer = async () => {
  Actions.registerAction(
    'StartExternalWarmTransfer',
    async (payload: { task?: ITask; sid?: string; phoneNumber: string }) => {
      // eslint-disable-next-line prefer-const
      let { task, sid, phoneNumber } = payload;
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

      const workerFromNumber = Manager.getInstance().store.getState().flex.worker.attributes.phone;

      let from;
      if (workerFromNumber) {
        from = workerFromNumber;
      } else {
        from = Manager.getInstance().serviceConfiguration.outbound_call_flows.default.caller_id;
      }

      // Adding entered number to the conference
      console.log(`Adding ${phoneNumber} to conference`);
      let participantCallSid;
      try {
        participantCallSid = await ConferenceService.addParticipant(mainConferenceSid, from, phoneNumber);

        Manager.getInstance().store.dispatch(
          addConnectingParticipant({
            callSid: participantCallSid,
            conferenceSid: mainConferenceSid,
            phoneNumber,
          }),
        );
      } catch (error) {
        console.error('Error adding conference participant:', error);
      }
    },
  );
};
