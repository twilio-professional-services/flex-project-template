import * as React from 'react';
import { TaskHelper, useFlexSelector, ITask, IconButton, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Stack } from '@twilio-paste/core';
import { ParticipantTypes } from '@twilio/flex-ui/src/state/Participants/participants.types';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoach';
import BargeCoachService from '../../utils/serverless/BargeCoachService';
import { isAgentCoachingPanelEnabled } from '../../config';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync';

type SupervisorBargeCoachProps = {
  task: ITask;
};

export const SupervisorBargeCoachButtons = ({ task }: SupervisorBargeCoachProps) => {
  const dispatch = useDispatch();

  const { muted, barge, enableBargeinButton, coaching, enableCoachButton, privateMode } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const teamViewTaskSID = useFlexSelector((state) => state?.flex?.view?.selectedTaskInSupervisorSid) || '';
  const agentWorkerSID = useFlexSelector((state) => state?.flex?.supervisor?.stickyWorker?.worker?.sid) || '';
  const myWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const supervisorFN = useFlexSelector((state) => state?.flex?.worker?.attributes?.full_name) || '';

  // Confirming if Agent Coaching Panel is enabled, we will use this in the Supervisor Barge Coach component
  const agent_coaching_panel = isAgentCoachingPanelEnabled();

  // Storing teamViewPath to browser cache to help if a refresh happens
  // will use this in the browserRefreshHelper
  if (teamViewTaskSID && agentWorkerSID) {
    localStorage.setItem('teamViewTaskSID', teamViewTaskSID);
    localStorage.setItem('agentWorkerSID', agentWorkerSID);
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
      return;
    }

    // Checking the conference within the task for a participant with the value "supervisor",
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor,
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid
    // which we pull from mapStateToProps at the bottom of this js file
    const supervisorParticipant = conference?.source.channelParticipants.find(
      (p) =>
        p.type === ('supervisor' as ParticipantTypes) &&
        p.mediaProperties.status === 'joined' &&
        myWorkerSID === p.routingProperties.workerSid,
    );
    const participantSid = supervisorParticipant?.participantSid;

    // If the supervisorParticipant.key is null return, this would be rare and best practice to include this
    // before calling any function you do not want to send it null values unless your function is expecting that
    if (!supervisorParticipant || !participantSid) {
      return;
    }
    // Barge-in will "unmute" their line if the are muted, else "mute" their line if they are unmuted
    // Also account for coach status to enable/disable barge as we call this when clicking the mute/unmute button
    // For the BargeCoachService - we've consolidated this call into one function, we will call the third parameter (agentSid)
    // with an empty string, in the function we will check for this and only mute/unmute the participant if we see this
    // IE Don't update the coaching status/agent being coached
    if (muted) {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, '', false, coaching);
      if (coaching) {
        dispatch(
          Actions.setBargeCoachStatus({
            muted: false,
            barge: false,
          }),
        );
        // If agent_coaching_panel is true (enabled), proceed
        // otherwise we will not update to the Sync Doc
        if (agent_coaching_panel && !privateMode) {
          const supervisorStatus = 'coaching';
          const updateStatus = 'update';
          // Updating the Sync Doc to reflect that we are no longer barging and back into Monitoring
          SyncDoc.initSyncDocSupervisors(
            agentWorkerSID,
            conferenceSid,
            myWorkerSID,
            supervisorFN,
            supervisorStatus,
            updateStatus,
          );
        }
      } else {
        dispatch(
          Actions.setBargeCoachStatus({
            muted: false,
            barge: true,
          }),
        );
        // If agent_coaching_panel is true (enabled), proceed
        // otherwise we will not update to the Sync Doc
        if (agent_coaching_panel && !privateMode) {
          const supervisorStatus = 'barge';
          const updateStatus = 'update';
          // Updating the Sync Doc to reflect that we are no longer barging and back into Monitoring
          SyncDoc.initSyncDocSupervisors(
            agentWorkerSID,
            conferenceSid,
            myWorkerSID,
            supervisorFN,
            supervisorStatus,
            updateStatus,
          );
        }
      }
    } else {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, '', true, coaching);
      if (coaching) {
        dispatch(
          Actions.setBargeCoachStatus({
            muted: true,
            barge: false,
          }),
        );
      } else {
        dispatch(
          Actions.setBargeCoachStatus({
            muted: true,
            barge: true,
          }),
        );
      }
    }
  };

  // On click we will be pulling the conference SID and supervisorSID
  // to trigger Mute / Unmute respectively for that user
  // We've built in resiliency if the supervisor refreshes their browser
  // or clicks monitor/un-monitor multiple times, it still confirms that
  // we allow the correct worker to coach on the call

  const coachHandleClick = () => {
    const conference = task && task.conference;
    const conferenceSid = conference?.conferenceSid;
    if (!conferenceSid) {
      return;
    }

    // Checking the conference within the task for a participant with the value "supervisor",
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor,
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid
    // which we pull from mapStateToProps at the bottom of this js file
    const supervisorParticipant = conference?.source.channelParticipants.find(
      (p) =>
        p.type === ('supervisor' as ParticipantTypes) &&
        p.mediaProperties.status === 'joined' &&
        myWorkerSID === p.routingProperties.workerSid,
    );
    const participantSid = supervisorParticipant?.participantSid;

    // Pulling the agentSid that we will be coaching on this conference
    // Ensuring they are a worker (IE agent) and it matches the agentWorkerSid we pulled from the props
    const agentParticipant = conference?.participants.find(
      (p) => p.participantType === 'worker' && agentWorkerSID === p.workerSid,
    );
    const agentSid = agentParticipant?.callSid;

    // If the agentParticipant.key or supervisorParticipant.key is null return, this would be rare and best practice to include this
    // before calling any function you do not want to send it null values unless your function is expecting that
    if (!agentSid || !participantSid) {
      return;
    }
    // Coaching will "enable" their line if they are disabled, else "disable" their line if they are enabled
    if (coaching) {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentSid, true, false);
      dispatch(
        Actions.setBargeCoachStatus({
          coaching: false,
          muted: true,
          barge: false,
        }),
      );

      // If agent_coaching_panel is true (enabled), proceed
      // otherwise we will not update to the Sync Doc
      if (agent_coaching_panel && !privateMode) {
        // Updating the Sync Doc to reflect that we are no longer coaching and back into Monitoring
        const supervisorStatus = 'monitoring';
        const updateStatus = 'update';
        SyncDoc.initSyncDocSupervisors(
          agentWorkerSID,
          conferenceSid,
          myWorkerSID,
          supervisorFN,
          supervisorStatus,
          updateStatus,
        );
      }
    } else {
      BargeCoachService.updateParticipantBargeCoach(conferenceSid, participantSid, agentSid, false, true);
      dispatch(
        Actions.setBargeCoachStatus({
          coaching: true,
          muted: false,
          barge: false,
        }),
      );

      // If agent_coaching_panel is true (enabled), proceed
      // otherwise we will not update to the Sync Doc
      if (agent_coaching_panel && !privateMode) {
        const supervisorStatus = 'coaching';
        const updateStatus = 'update';
        // Updating the Sync Doc to reflect that we are now coaching the agent
        SyncDoc.initSyncDocSupervisors(
          agentWorkerSID,
          conferenceSid,
          myWorkerSID,
          supervisorFN,
          supervisorStatus,
          updateStatus,
        );
      }
    }
  };

  // Return the coach and barge-in buttons, disable if the call isn't live or
  // if the supervisor isn't monitoring the call, toggle the icon based on coach and barge-in status
  const isLiveCall = TaskHelper.isLiveCall(task);

  return (
    <Flex hAlignContent="center" vertical>
      <Stack orientation="horizontal" spacing="space30" element="BARGE_COACH_BUTTON_BOX">
        <IconButton
          icon={muted ? 'MuteLargeBold' : 'MuteLarge'}
          disabled={!isLiveCall || !enableBargeinButton || !enableCoachButton || (!barge && !coaching)}
          onClick={bargeHandleClick}
          title={muted ? templates.UnmuteAriaLabel() : templates.MuteCallTooltip()}
          variant="secondary"
          style={{ width: '44px', height: '44px' }}
        ></IconButton>
        <IconButton
          icon={barge ? `IncomingCallBold` : 'IncomingCall'}
          disabled={!isLiveCall || !enableBargeinButton || coaching}
          onClick={bargeHandleClick}
          title={barge ? templates[StringTemplates.BargeOut]() : templates[StringTemplates.BargeIn]()}
          variant={barge ? 'primary' : 'secondary'}
          style={{ width: '44px', height: '44px' }}
        />
        <IconButton
          icon={coaching ? `DefaultAvatarBold` : `DefaultAvatar`}
          disabled={!isLiveCall || !enableCoachButton}
          onClick={coachHandleClick}
          title={coaching ? templates[StringTemplates.DisableCoach]() : templates[StringTemplates.EnableCoach]()}
          variant={coaching ? 'primary' : 'secondary'}
          style={{ width: '44px', height: '44px' }}
        />
      </Stack>
    </Flex>
  );
};
