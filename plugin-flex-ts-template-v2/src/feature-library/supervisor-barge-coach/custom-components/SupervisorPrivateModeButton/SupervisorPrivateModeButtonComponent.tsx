import * as React from 'react';
import { TaskHelper, useFlexSelector, ITask, IconButton, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Stack } from '@twilio-paste/core';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoach';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync';

type SupervisorPrivateToggleProps = {
  task: ITask;
};

export const SupervisorPrivateToggle = ({ task }: SupervisorPrivateToggleProps) => {
  const dispatch = useDispatch();

  const { barge, coaching, privateMode } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const agentWorkerSID = useFlexSelector((state) => state?.flex?.supervisor?.stickyWorker?.worker?.sid) || '';
  const myWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const supervisorFN = useFlexSelector((state) => state?.flex?.worker?.attributes?.full_name) || '';

  // We will toggle the private mode on/off based on the button click and the state
  // of the coachingStatusPanel along with udpating the Sync Doc appropriately
  const togglePrivateMode = () => {
    const conference = task && task.conference;
    const conferenceSID = conference?.conferenceSid || '';

    // If privateMode is true, toggle to false and update the Sync Doc with the appropriate Supervisor and Status
    if (privateMode) {
      // Caching this to help with browser refresh recovery
      localStorage.setItem('privateMode', 'false');
      dispatch(
        Actions.setBargeCoachStatus({
          privateMode: false,
        }),
      );
      if (coaching) {
        const supervisorStatus = 'coaching';
        const updateStatus = 'add';
        SyncDoc.initSyncDocSupervisors(
          agentWorkerSID,
          conferenceSID,
          myWorkerSID,
          supervisorFN,
          supervisorStatus,
          updateStatus,
        );
      } else if (barge) {
        const supervisorStatus = 'barge';
        const updateStatus = 'add';
        SyncDoc.initSyncDocSupervisors(
          agentWorkerSID,
          conferenceSID,
          myWorkerSID,
          supervisorFN,
          supervisorStatus,
          updateStatus,
        );
      } else {
        const supervisorStatus = 'monitoring';
        const updateStatus = 'add';
        SyncDoc.initSyncDocSupervisors(
          agentWorkerSID,
          conferenceSID,
          myWorkerSID,
          supervisorFN,
          supervisorStatus,
          updateStatus,
        );
      }
      // If privateMode is false, toggle to true and remove the Supervisor from the Sync Doc
    } else {
      // Caching this to help with browser refresh recovery
      localStorage.setItem('privateMode', 'true');
      dispatch(
        Actions.setBargeCoachStatus({
          privateMode: true,
        }),
      );
      SyncDoc.initSyncDocSupervisors(agentWorkerSID, conferenceSID, myWorkerSID, supervisorFN, '', 'remove');
    }
  };

  // Render the Supervisor Private Mode Button to toggle if the supervisor wishes to remain private when
  // coaching the agent

  const isLiveCall = TaskHelper.isLiveCall(task);

  return (
    <Flex hAlignContent="center" vertical padding="space30">
      <Stack orientation="horizontal" spacing="space30" element="SUPERVISOR_PRIVATE_BUTTON_BOX">
        <IconButton
          icon={privateMode ? 'EyeBold' : 'Eye'}
          disabled={!isLiveCall}
          onClick={togglePrivateMode}
          title={privateMode ? templates[StringTemplates.DisablePrivacy]() : templates[StringTemplates.EnablePrivacy]()}
          variant="secondary"
        />
        {privateMode ? templates[StringTemplates.PrivacyOn]() : templates[StringTemplates.PrivacyOff]()}
      </Stack>
    </Flex>
  );
};
