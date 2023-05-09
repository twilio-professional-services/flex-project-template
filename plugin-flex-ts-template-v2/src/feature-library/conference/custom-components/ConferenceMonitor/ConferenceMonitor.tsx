import { Actions, ConferenceParticipant, ITask } from '@twilio/flex-ui';
import * as React from 'react';

import ConferenceService from '../../utils/ConferenceService';
import { isConferenceEnabledWithoutNativeXWT, isHoldWorkaroundEnabled } from '../../config';

export interface OwnProps {
  task?: ITask;
}

class ConferenceMonitor extends React.Component {
  state = {
    liveParticipantCount: 0,
    didMyWorkerJoinYet: false,
    stopMonitoring: false,
  };

  componentDidUpdate() {
    if (this.state.stopMonitoring) {
      return;
    }

    const { task } = this.props as OwnProps;

    const conference = task && task.conference;
    const conferenceSid = conference?.conferenceSid;

    if (!conference || !conferenceSid) return;

    const { liveParticipantCount, liveWorkerCount, participants = [] } = conference;
    const liveParticipants = participants.filter((p: ConferenceParticipant) => p.status === 'joined');
    const myActiveParticipant = liveParticipants.find((p: ConferenceParticipant) => p.isCurrentWorker);

    if (
      liveParticipantCount > 2 &&
      this.state.liveParticipantCount <= 2 &&
      this.shouldUpdateParticipants(participants, liveWorkerCount)
    ) {
      this.handleMoreThanTwoParticipants(task, conferenceSid, liveParticipants);
    } else if (
      liveParticipantCount <= 2 &&
      this.state.liveParticipantCount > 2 &&
      this.shouldUpdateParticipants(participants, liveWorkerCount)
    ) {
      this.handleOnlyTwoParticipants(task, conferenceSid, liveParticipants);
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
      console.debug('ConferenceMonitor: My participant left. Time to STOP monitoring this task/conference');
      this.setState({ stopMonitoring: true, didMyWorkerJoinYet: false });
    }
  }

  hasUnknownParticipant = (participants: ConferenceParticipant[] = []) => {
    return participants.some((p) => p.participantType === 'unknown' || p.participantType === 'external');
  };

  shouldUpdateParticipants = (participants: ConferenceParticipant[], liveWorkerCount: number) => {
    console.debug(
      'ConferenceMonitor: shouldUpdateParticipants:',
      liveWorkerCount <= 1 && this.hasUnknownParticipant(participants),
    );
    return liveWorkerCount <= 1 && this.hasUnknownParticipant(participants);
  };

  handleMoreThanTwoParticipants = (task: ITask, conferenceSid: string, participants: ConferenceParticipant[]) => {
    console.log(
      'ConferenceMonitor: More than two conference participants. Setting endConferenceOnExit to false for all participants.',
    );
    this.setEndConferenceOnExit(task, conferenceSid, participants, false);
  };

  handleOnlyTwoParticipants = (task: ITask, conferenceSid: string, participants: ConferenceParticipant[]) => {
    console.log(
      'ConferenceMonitor: Conference participants dropped to two. Setting endConferenceOnExit to true for all participants.',
    );
    this.setEndConferenceOnExit(task, conferenceSid, participants, true);
  };

  setEndConferenceOnExit = async (
    task: ITask,
    conferenceSid: string,
    participants: ConferenceParticipant[],
    endConferenceOnExit: boolean,
  ) => {
    const promises = [] as Promise<void>[];

    participants.forEach((p) => {
      promises.push(
        this.performParticipantUpdate(
          task,
          conferenceSid,
          p,
          endConferenceOnExit,
          isHoldWorkaroundEnabled(),
          isConferenceEnabledWithoutNativeXWT(),
        ),
      );
    });

    try {
      await Promise.all(promises);
      console.log(`ConferenceMonitor: endConferenceOnExit set to ${endConferenceOnExit} for all participants`);
    } catch (error) {
      console.error(
        `ConferenceMonitor: Error setting endConferenceOnExit to ${endConferenceOnExit} for all participants\r\n`,
        error,
      );
    }
  };

  performParticipantUpdate = async (
    task: ITask,
    conferenceSid: string,
    participant: ConferenceParticipant,
    endConferenceOnExit: boolean,
    hold_workaround: boolean,
    add_button: boolean,
  ) => {
    if (participant.connecting || !participant.callSid || (!add_button && participant.participantType === 'worker')) {
      // skip setting end conference on connecting parties as it will fail
      // only set on customer participants because Flex sets the others for us
      return;
    }
    console.log(
      `ConferenceMonitor: setting endConferenceOnExit = ${endConferenceOnExit} for callSid: ${participant.callSid} status: ${participant.status}`,
    );

    let doWorkaround = false;

    if (participant.onHold && hold_workaround) {
      // The hold workaround will briefly take a held participant off hold so that we can update endConferenceOnExit.
      // Unfortunately, setting endConferenceOnExit doesn't take effect if done while the participant is held.
      doWorkaround = true;
    }

    if (doWorkaround) {
      await Actions.invokeAction('UnholdParticipant', {
        participantType: participant.participantType,
        task,
        targetSid: participant.callSid,
      });
    }

    await ConferenceService.setEndConferenceOnExit(conferenceSid, participant.callSid, endConferenceOnExit);

    if (doWorkaround) {
      await Actions.invokeAction('HoldParticipant', {
        participantType: participant.participantType,
        task,
        targetSid: participant.callSid,
      });
    }
  };

  render() {
    // This is a Renderless Component, only used for monitoring and taking action on conferences
    return null;
  }
}

export default ConferenceMonitor;
