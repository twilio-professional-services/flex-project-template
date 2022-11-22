import * as Flex from '@twilio/flex-ui';
import { ConferenceNotification } from '../notifications/Conference';
import { isAddButtonEnabled } from '../..';

export function handleConferenceHangup(flex: typeof Flex, manager: Flex.Manager) {
  if (!isAddButtonEnabled()) return;

  flex.Actions.addListener('beforeHangupCall', async (payload, abortFunction) => {
    const { conference, taskSid } = payload.task;
    const participantsOnHold = (participant: Flex.ConferenceParticipant) => {
      return participant.onHold && participant.status === "joined";
    };
    const snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const getLatestConference = (taskSid: string) => {
      const updatedTask = Flex.StateHelper.getTaskByTaskrouterTaskSid(taskSid)
      return updatedTask.conference
    }
  
    // check if worker hanging up is last worker on the call
    if (conference && conference.liveWorkerCount === 1) {
  
      //if so, ensure no other participants are on hold as 
      //no external parties will be able to remove them from being on hold.
      conference.participants.forEach(async (participant: Flex.ConferenceParticipant) => {
        const { participantType, workerSid, callSid } = participant;
        if (participant.onHold && participant.status === "joined") {
          try {
            await flex.Actions.invokeAction("UnholdParticipant", {
              participantType,
              task: payload.task,
              targetSid: participantType === 'worker' ? workerSid : callSid
            });
          } catch (error) {
            console.log('Conference: unable to unhold participant', error)
          }
        }
      });
  
      // make sure this operation blocks hanging up the call until 
      // all participants are taken off hold or max wait time is reached
      let attempts = 0;
      let updatedConference = getLatestConference(taskSid);
      
      if (!updatedConference) return;
      
      let { participants } = updatedConference;
      while (participants.some(participantsOnHold) && attempts < 10) {
        await snooze(500);
        attempts++;
        updatedConference = getLatestConference(taskSid);
        participants = updatedConference ? updatedConference.participants : [];
      }
  
      // if some participants are still on hold, abort hanging up the call
      if (updatedConference && updatedConference.participants.some(participantsOnHold)) {
        Flex.Notifications.showNotification(ConferenceNotification.FailedHangupNotification);
        abortFunction();
      }
    }
  });
}
