import * as React from 'react';
import { TaskHelper, useFlexSelector, ITask, Manager, IconButton } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { Actions } from "../../flex-hooks/states/SupervisorBargeCoach"
import BargeCoachService from '../../utils/serverless/BargeCoachService';
import { Flex, Stack } from "@twilio-paste/core";
import { isAgentCoachingPanelEnabled } from '../..';

// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync'
import { ParticipantTypes } from '@twilio/flex-ui/src/state/Participants/participants.types';

type SupervisorBargeCoachProps = {
  task: ITask
}

export const SupervisorBargeCoachButtons = ({task}: SupervisorBargeCoachProps) => {
  const dispatch = useDispatch();

  const {
    muted, 
    barge, 
    enableBargeinButton, 
    coaching, 
    enableCoachButton, 
    privateMode
  } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const teamViewTaskSID = useFlexSelector(state => state?.flex?.view?.selectedTaskInSupervisorSid);
  const agentWorkerSID = useFlexSelector(state => state?.flex?.supervisor?.stickyWorker?.worker?.sid);
  const myWorkerSID = useFlexSelector(state => state?.flex?.worker?.worker?.sid);
  const supervisorFN = useFlexSelector(state => state?.flex?.worker?.attributes?.full_name);

  // Confirming if Agent Coaching Panel is enabled, we will use this in the Supervisor Barge Coach component
  const agent_coaching_panel = isAgentCoachingPanelEnabled();


  // Storing teamViewPath and agentSyncDoc to browser cache to help if a refresh happens
  // will use this in the main plugin file to invoke an action to reset the monitor panel
  // and clear the Agent's Sync Doc
  if (teamViewTaskSID != null) {
    console.log('Storing teamViewPath to cache');
    localStorage.setItem('teamViewTaskSID',teamViewTaskSID);

    console.log('Storing agentSyncDoc to cache');
    localStorage.setItem('agentSyncDoc',`syncDoc.${agentWorkerSID}`);
  }


  // On click we will be pulling the conference SID and supervisorSID
  // to trigger Mute / Unmute respectively for that user - muted comes from the redux store
  // We've built in resiliency if the supervisor refreshes their browser
  // or clicks monitor/un-monitor multiple times, it still confirms that
  // we allow the correct user to barge-in on the call
  const bargeHandleClick = () => {
    const conference = task && task.conference;
    const conferenceSid = conference?.conferenceSid;
    if (!conferenceSid) {
      console.log('conferenceSid = null, returning');
      return;
    }

    // Checking the conference within the task for a participant with the value "supervisor", 
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor, 
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid 
    // which we pull from mapStateToProps at the bottom of this js file
    const supervisorParticipant = conference?.source.channelParticipants.find(p => p.type === 'supervisor' as ParticipantTypes 
      && p.mediaProperties.status === 'joined' 
      && myWorkerSID === p.routingProperties.workerSid);
    const participantSid = supervisorParticipant?.participantSid;
    console.log(`Current supervisorSID = ${supervisorParticipant?.participantSid}`);

    // If the supervisorParticipant.key is null return, this would be rare and best practice to include this
    // before calling any function you do not want to send it null values unless your function is expecting that
    if (!supervisorParticipant || !participantSid) {
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
        dispatch(Actions.setBargeCoachStatus({ 
          muted: false, 
          barge: false
        }));
        // If agent_coaching_panel is true (enabled), proceed
        // otherwise we will not update to the Sync Doc
        if (agent_coaching_panel && !privateMode) {
          // Updating the Sync Doc to reflect that we are no longer barging and back into Monitoring
          SyncDoc.initSyncDoc(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, "is Coaching", "update");
        }
      } else {
        dispatch(Actions.setBargeCoachStatus({ 
          muted: false,
          barge: true
        }));
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
        dispatch(Actions.setBargeCoachStatus({ 
          muted: true,
          barge: false 
        }));
      } else {
        dispatch(Actions.setBargeCoachStatus({ 
          muted: true,
          barge: true
        }));
      }
    }
  }

  // On click we will be pulling the conference SID and supervisorSID
  // to trigger Mute / Unmute respectively for that user
  // We've built in resiliency if the supervisor refreshes their browser
  // or clicks monitor/un-monitor multiple times, it still confirms that
  // we allow the correct worker to coach on the call

  const coachHandleClick = () => {
    const conference = task && task.conference;
    const conferenceSid = conference?.conferenceSid;
    if (!conferenceSid) {
      console.log('conferenceSid = null, returning');
      return;
    }

    // Checking the conference within the task for a participant with the value "supervisor", 
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor, 
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid 
    // which we pull from mapStateToProps at the bottom of this js file
    const supervisorParticipant = conference?.source.channelParticipants.find(p => p.type === 'supervisor' as ParticipantTypes 
      && p.mediaProperties.status === 'joined' 
      && myWorkerSID === p.routingProperties.workerSid);
    const participantSid = supervisorParticipant?.participantSid;
    console.log(`Current supervisorSID = ${supervisorParticipant?.participantSid}`);

    // Pulling the agentSid that we will be coaching on this conference
    // Ensuring they are a worker (IE agent) and it matches the agentWorkerSid we pulled from the props
    let agentParticipant = conference?.participants.find(p => p.participantType === 'worker'
    && agentWorkerSID === p.workerSid);
    const agentSid = agentParticipant?.callSid;
    
    console.log(`Current agentWorkerSid = ${agentWorkerSID}`);
    console.log(`Current agentSid = ${agentSid}`);

    // If the agentParticipant.key or supervisorParticipant.key is null return, this would be rare and best practice to include this
    // before calling any function you do not want to send it null values unless your function is expecting that
    if (!agentSid || !participantSid) {
      console.log('agentParticipant.key or supervisorParticipant.key = null, returning');
      return;
    }
    // Coaching will "enable" their line if they are disabled, else "disable" their line if they are enabled
    if (coaching) {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentSid, true, false);
      dispatch(Actions.setBargeCoachStatus({ 
        coaching: false,
        muted: true,
        barge: false
      }));

      // If agent_coaching_panel is true (enabled), proceed
      // otherwise we will not update to the Sync Doc
      if (agent_coaching_panel && !privateMode) {
        // Updating the Sync Doc to reflect that we are no longer coaching and back into Monitoring
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, "is Monitoring", "update");
      }

    } else {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentSid, false, true);
      dispatch(Actions.setBargeCoachStatus({ 
        coaching: true,
        muted: false,
        barge: false 
      }));

      // If agent_coaching_panel is true (enabled), proceed
      // otherwise we will not update to the Sync Doc
      if (agent_coaching_panel && !privateMode) {
        // Updating the Sync Doc to reflect that we are now coaching the agent
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSid, myWorkerSID, supervisorFN, "is Coaching", "update");
      }
    }
  }

  // Return the coach and barge-in buttons, disable if the call isn't live or
  // if the supervisor isn't monitoring the call, toggle the icon based on coach and barge-in status
  const isLiveCall = TaskHelper.isLiveCall(task);
  return (
    <> 
      <Flex hAlignContent="center" vertical>
        <Stack orientation="horizontal" spacing="space30" element="BARGE_COACH_BUTTON_BOX">
          <IconButton
            icon={ muted ? 'MuteLargeBold' : 'MuteLarge' }
            disabled={!isLiveCall || !enableBargeinButton || !enableCoachButton || (!barge && !coaching) }
            onClick={bargeHandleClick}
            title={ muted ? "Unmute" : "Mute" }
            variant="secondary"
            style={{width:'44px',height:'44px'}}
          ></IconButton>
          <IconButton
            icon={ barge ? `IncomingCallBold` :  'IncomingCall' }
            disabled={!isLiveCall || !enableBargeinButton || coaching }
            onClick={bargeHandleClick}
            title={ barge ? 'Barge-Out' : 'Barge-In' }
            variant={ barge ? 'primary' : 'secondary' }
            style={{width:'44px',height:'44px'}}
          />
          <IconButton
            icon={ coaching ? `DefaultAvatarBold` : `DefaultAvatar` }
            disabled={!isLiveCall || !enableCoachButton}
            onClick={coachHandleClick}
            title={ coaching ? "Disable Coach Mode" : "Enable Coach Mode" }
            variant={ coaching ? 'primary' : 'secondary' }
            style={{width:'44px',height:'44px'}}
          />
        </Stack>
      </Flex>
    </>
  );
}
