import * as Flex from "@twilio/flex-ui";
import { addCallDataToTask, waitForConferenceParticipants } from "../../helpers/dualChannelHelper";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import RecordingService from "../../../pause-recording/helpers/RecordingService";
import { isFeatureEnabled, getChannelToRecord } from '../..';

const taskAcceptedHandler = async (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled() || !Flex.TaskHelper.isCallTask(task)) {
    return;
  }
  
  const { attributes } = task;
  const { conversations } = attributes;
  
  if (
    conversations &&
    conversations.media &&
    getChannelToRecord() == 'customer'
  ) {
    // This indicates a recording has already been started for this call
    // and all relevant metadata should already be on task attributes
    return;
  }
  
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
  
  // Choosing to record the customer call SID here. If you want to record
  // the worker leg of the call instead, adjust the logic above to find
  // the worker participant and use that call SID instead.
  const { callSid } = participantLeg;
  
  if (!callSid) return;
  
  try {
    const recording = await RecordingService.startDualChannelRecording(callSid);
    await addCallDataToTask(task, callSid, recording);
  } catch (error) {
    console.error('Unable to start dual channel recording.', error);
  }
}

export default taskAcceptedHandler;
