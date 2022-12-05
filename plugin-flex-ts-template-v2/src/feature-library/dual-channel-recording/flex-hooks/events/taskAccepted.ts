import * as Flex from "@twilio/flex-ui";
import { addCallDataToTask, waitForConferenceParticipants, waitForActiveCall } from "../../helpers/dualChannelHelper";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import RecordingService from "../../../pause-recording/helpers/RecordingService";
import { isFeatureEnabled, getChannelToRecord } from '../..';

const taskAcceptedHandler = async (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled() || !Flex.TaskHelper.isCallTask(task)) {
    return;
  }
  
  const { attributes } = task;
  const { client_call, direction, conversations } = attributes;
  let callSid;
  
  if (
    conversations &&
    conversations.media &&
    getChannelToRecord() == 'customer'
  ) {
    // This indicates a recording has already been started for this call
    // and all relevant metadata should already be on task attributes
    return;
  }

  if (client_call && direction === "outbound") {
    // internal call - always record based on call SID, as conference state is unknown by Flex
    // Record only the outbound leg to prevent duplicate recordings
    console.debug('Waiting for internal call to begin');
    callSid = await waitForActiveCall(task);
    console.debug('Recorded internal call:', callSid);
  } else if (client_call) {
    // internal call, inbound leg - skip recording this leg
    console.debug('Skipping recording for inbound internal call', task.sid);
  } else {
    // We want to wait for all participants (customer and worker) to join the
    // conference before we start the recording
    console.debug('Waiting for customer and worker to join the conference');
    const participants = await waitForConferenceParticipants(task);
    
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
    
    console.debug('Recorded Participant: ', participantLeg);
    
    if (!participantLeg) {
      console.warn(
        'No customer or worker participant. Not starting the call recording'
      );
      return;
    }
    
    callSid = participantLeg.callSid;
  }
  
  if (!callSid) {
    console.warn('Unable to determine call SID for recording');
    return;
  }
  
  try {
    const recording = await RecordingService.startDualChannelRecording(callSid);
    await addCallDataToTask(task, callSid, recording);
  } catch (error) {
    console.error('Unable to start dual channel recording.', error);
  }
}

export default taskAcceptedHandler;
