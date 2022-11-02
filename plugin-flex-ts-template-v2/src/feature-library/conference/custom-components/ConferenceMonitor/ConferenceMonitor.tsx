import { ConferenceParticipant, ITask } from '@twilio/flex-ui';
import * as React from 'react';
import ConferenceService from '../../utils/ConferenceService';

export interface OwnProps {
  task?: ITask
}

class ConferenceMonitor extends React.Component {
  state = {
    liveParticipantCount: 0,
    didMyWorkerJoinYet: false,
    stopMonitoring: false
  }

  componentDidUpdate() {

    if (this.state.stopMonitoring) {
      return;
    }

    const { task } = this.props as OwnProps;

    const conference = task && task.conference;
    const conferenceSid = task?.attributes?.conference?.sid;
    
    if (!conference || !conferenceSid) return;
    
    const {
      liveParticipantCount,
      liveWorkerCount,
      participants = []
    } = conference;
    const liveParticipants = participants.filter((p: ConferenceParticipant) => p.status === 'joined');
    const myActiveParticipant = liveParticipants.find((p: ConferenceParticipant) => p.isCurrentWorker);


    if (liveParticipantCount > 2 && this.state.liveParticipantCount <= 2) {
      if (this.shouldUpdateParticipants(participants, liveWorkerCount)) {
        this.handleMoreThanTwoParticipants(conferenceSid, liveParticipants);
      }
    } else if (liveParticipantCount <= 2 && this.state.liveParticipantCount > 2) {
      if (this.shouldUpdateParticipants(participants, liveWorkerCount)) {
        this.handleOnlyTwoParticipants(conferenceSid, liveParticipants);
      }
    }

    if (liveParticipantCount !== this.state.liveParticipantCount) {      
      this.setState({ liveParticipantCount });
    }
    

    if (!this.state.didMyWorkerJoinYet && myActiveParticipant) {
      // Store the fact that my worker has clearly joined the conference - for use later
      this.setState({ didMyWorkerJoinYet: true });
    }

    if (this.state.didMyWorkerJoinYet && !myActiveParticipant) {
      // My worker has clearly left since previously joining
      // Time to stop monitoring at this point. Covers warm and cold transfers and generally stops Flex UI from tinkering
      // once the agent is done with the call.
      console.debug('dialpad-addon, ConferenceMonitor, componentDidUpdate: My participant left. Time to STOP monitoring this task/conference');
      this.setState({ stopMonitoring: true, didMyWorkerJoinYet: false });
    }

  }


  hasUnknownParticipant = (participants: ConferenceParticipant[] = []) => {
    return participants.some(p => p.participantType === 'unknown');
  }

  shouldUpdateParticipants = (participants: ConferenceParticipant[], liveWorkerCount: number) => {
    console.debug(
      'dialpad-addon, ConferenceMonitor, shouldUpdateParticipants:',
      liveWorkerCount <= 1 && this.hasUnknownParticipant(participants)
    );
    return liveWorkerCount <= 1 && this.hasUnknownParticipant(participants);
  }

  handleMoreThanTwoParticipants = (conferenceSid: string, participants: ConferenceParticipant[]) => {
    console.log('More than two conference participants. Setting endConferenceOnExit to false for all participants.');
    this.setEndConferenceOnExit(conferenceSid, participants, false);
  }

  handleOnlyTwoParticipants = (conferenceSid: string, participants: ConferenceParticipant[]) => {
    console.log('Conference participants dropped to two. Setting endConferenceOnExit to true for all participants.');
    this.setEndConferenceOnExit(conferenceSid, participants, true);
  }

  setEndConferenceOnExit = async (conferenceSid: string, participants: ConferenceParticipant[], endConferenceOnExit: boolean) => {
    const promises = [] as Promise<string>[];
    participants.forEach(p => {
      console.log(`setting endConferenceOnExit = ${endConferenceOnExit} for callSid: ${p.callSid} status: ${p.status}`);
      if (p.connecting || !p.callSid) { return } //skip setting end conference on connecting parties as it will fail
      promises.push(
        ConferenceService.setEndConferenceOnExit(conferenceSid, p.callSid, endConferenceOnExit)
      );
    });

    try {
      await Promise.all(promises);
      console.log(`endConferenceOnExit set to ${endConferenceOnExit} for all participants`);
    } catch (error) {
      console.error(`Error setting endConferenceOnExit to ${endConferenceOnExit} for all participants\r\n`, error);
    }
  }

  render() {
    // This is a Renderless Component, only used for monitoring and taking action on conferences
    return null;
  }
}

export default ConferenceMonitor;
