import * as React from 'react';
import * as Flex from '@twilio/flex-ui';
import { IconButton, TaskHelper } from '@twilio/flex-ui';
import { ContainerProps } from './SupervisorBargeCoachButtonContainer'

import BargeCoachService from '../../utils/serverless/BargeCoachService';

import { ButtonContainer, buttonStyle, buttonStyleActive } from './SupervisorBargeCoachButtonStyles';

// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync'

export interface OwnProps {
  task?: Flex.ITask;
  theme?: Flex.Theme;
}

export type Props = ContainerProps & OwnProps;

export default class SupervisorBargeCoachButton extends React.Component<Props> {

  // On click we will be pulling the conference SID and supervisorSID
  // to trigger Mute / Unmute respectively for that user - muted comes from the redux store
  // We've built in resiliency if the supervisor refreshes their browser
  // or clicks monitor/un-monitor multiple times, it still confirms that
  // we allow the correct user to barge-in on the call
  bargeHandleClick = () => {
    const { task, muted, coaching, agent_coaching_panel, agentWorkerSID ,myWorkerSID, supervisorFN, privateMode }: any = this.props;
    const conference = task && task.conference;
    const conferenceSid: string = conference?.conferenceSid;
    const conferenceChildren: any[] = conference?.source?.children || [];

    // Checking the conference within the task for a participant with the value "supervisor", 
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor, 
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid 
    // which we pull from mapStateToProps at the bottom of this js file
    const supervisorParticipant = conferenceChildren.find(p => p.value.participant_type === 'supervisor' 
      && p.value.status === 'joined' 
      && myWorkerSID === p.value.worker_sid);
    const participantSid = supervisorParticipant.key;
    console.log(`Current supervisorSID = ${supervisorParticipant.key}`);

    // If the supervisorParticipant.key is null return, this would be rare and best practice to include this
    // before calling any function you do not want to send it null values unless your function is expecting that
    if (supervisorParticipant.key == null) {
      console.log('supervisorParticipant.key = null, returning');
      return;
    }
    // Barge-in will "unmute" their line if the are muted, else "mute" their line if they are unmuted
    // Also account for coach status to enable/disable barge as we call this when clicking the mute/unmute button
    // For the BargeCoachService - we've consolidated this call into one function, we will call the third parameter (agentSid)
    // with an empty string, in the function we will check for this and only mute/unmute the participant if we see this
    // IE Don't update the coaching status/agent being coached
    if (muted) {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, "", false, coaching);
      if (coaching) {
        this.props.setBargeCoachStatus({ 
          muted: false, 
          barge: false
        });
        // If agent_coaching_panel is true (enabled), proceed
        // otherwise we will not update to the Sync Doc
        if (agent_coaching_panel && !privateMode) {
          // Updating the Sync Doc to reflect that we are no longer barging and back into Monitoring
          SyncDoc.initSyncDoc(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, "is Coaching", "update");
        }
      } else {
        this.props.setBargeCoachStatus({ 
          muted: false,
          barge: true
        });
        // If agent_coaching_panel is true (enabled), proceed
        // otherwise we will not update to the Sync Doc
        if (agent_coaching_panel && !privateMode) {
          // Updating the Sync Doc to reflect that we are no longer barging and back into Monitoring
          SyncDoc.initSyncDoc(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, "has Joined", "update");
        }
      }
    } else {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, "", true, coaching);
      if (coaching) {
        this.props.setBargeCoachStatus({ 
          muted: true,
          barge: false 
        });
      } else {
        this.props.setBargeCoachStatus({ 
          muted: true,
          barge: true
        });
      }
    }
  }

  // On click we will be pulling the conference SID and supervisorSID
  // to trigger Mute / Unmute respectively for that user
  // We've built in resiliency if the supervisor refreshes their browser
  // or clicks monitor/un-monitor multiple times, it still confirms that
  // we allow the correct worker to coach on the call

  coachHandleClick = () => {
    const { task, coaching, agent_coaching_panel, agentWorkerSID ,myWorkerSID, supervisorFN, privateMode }: any = this.props;
    const conference = task && task.conference;
    const conferenceSid: string = conference?.conferenceSid;
    const conferenceChildren: any[] = conference?.source?.children || [];

    // Checking the conference within the task for a participant with the value "supervisor", 
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor, 
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid 
    // which we pull from mapStateToProps at the bottom of this js file
    const supervisorParticipant = conferenceChildren.find(p => p.value.participant_type === 'supervisor' 
      && p.value.status === 'joined' 
      && myWorkerSID === p.value.worker_sid);
      const participantSid = supervisorParticipant.key;
    console.log(`Current supervisorSID = ${supervisorParticipant?.key}`);

    // Pulling the agentSid that we will be coaching on this conference
    // Ensuring they are a worker (IE agent) and it matches the agentWorkerSid we pulled from the props
    let agentParticipant = conferenceChildren.find(p => p.value.participant_type === 'worker'
    && this.props.agentWorkerSID === p.value.worker_sid);
    const agentSid = agentParticipant.key;
    
    console.log(`Current agentWorkerSid = ${this.props.agentWorkerSID}`);
    console.log(`Current agentSid = ${agentSid}`);

    // If the agentParticipant.key or supervisorParticipant.key is null return, this would be rare and best practice to include this
    // before calling any function you do not want to send it null values unless your function is expecting that
    if (agentParticipant?.key == null || supervisorParticipant?.key == null) {
      console.log('agentParticipant.key or supervisorParticipant.key = null, returning');
      return;
    }
    // Coaching will "enable" their line if they are disabled, else "disable" their line if they are enabled
    if (coaching) {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentSid, true, false);
      this.props.setBargeCoachStatus({ 
        coaching: false,
        muted: true,
        barge: false
      });

      // If agent_coaching_panel is true (enabled), proceed
      // otherwise we will not update to the Sync Doc
      if (agent_coaching_panel && !privateMode) {
        // Updating the Sync Doc to reflect that we are no longer coaching and back into Monitoring
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, "is Monitoring", "update");
      }

    } else {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentSid, false, true);
      this.props.setBargeCoachStatus({ 
        coaching: true,
        muted: false,
        barge: false 
      });

      // If agent_coaching_panel is true (enabled), proceed
      // otherwise we will not update to the Sync Doc
      if (agent_coaching_panel && !privateMode) {
        // Updating the Sync Doc to reflect that we are now coaching the agent
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, "is Coaching", "update");
      }
    }
  }

  // Render the coach and barge-in buttons, disable if the call isn't live or
  // if the supervisor isn't monitoring the call, toggle the icon based on coach and barge-in status
  render() {
    const { muted, barge, enableBargeinButton, coaching, enableCoachButton } = this.props;
    const task: any = this.props.task;

    const isLiveCall = TaskHelper.isLiveCall(task);

    return (
      <ButtonContainer>
        <IconButton
          icon={ muted ? 'MuteLargeBold' : 'MuteLarge' }
          disabled={!isLiveCall || !enableBargeinButton || !enableCoachButton || (!barge && !coaching) }
          onClick={this.bargeHandleClick}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={ muted ? "Unmute" : "Mute" }
          style={buttonStyle}
        ></IconButton>
        <IconButton
          icon={ barge ? `IncomingCallBold` :  'IncomingCall' }
          disabled={!isLiveCall || !enableBargeinButton || coaching }
          onClick={this.bargeHandleClick}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={ barge ? 'Barge-Out' : 'Barge-In' }
          style={ barge ? buttonStyleActive : buttonStyle }
        />
        <IconButton
          icon={ coaching ? `DefaultAvatarBold` : `DefaultAvatar` }
          disabled={!isLiveCall || !enableCoachButton}
          onClick={this.coachHandleClick}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={ coaching ? "Disable Coach Mode" : "Enable Coach Mode" }
          style={ coaching ? buttonStyleActive : buttonStyle }
        />
      </ButtonContainer>
    );
  }
}