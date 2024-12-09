import * as React from 'react';
import { TaskHelper, useFlexSelector, ITask, IconButton, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { setBargeCoachStatus, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync';

type SupervisorPrivateToggleProps = {
  task: ITask;
};

export const SupervisorPrivateToggle = ({ task }: SupervisorPrivateToggleProps) => {
  const dispatch = useDispatch();

  const { coaching, muted, privateMode } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const agentWorkerSID = useFlexSelector((state) => state?.flex?.supervisor?.callMonitoring?.task?.workerSid) || '';
  const monitoringState = useFlexSelector((state) => state?.flex?.supervisor?.callMonitoring?.status) || 0;
  const myWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const supervisorFN = useFlexSelector((state) => state?.flex?.worker?.attributes?.full_name) || '';

  // We will toggle the private mode on/off based on the button click and the state
  // of the coachingStatusPanel along with updating the Sync Doc appropriately
  const togglePrivateMode = () => {
    const conference = task && task.conference;
    const conferenceSID = conference?.conferenceSid || '';
    const newValue = !privateMode;

    // Caching this to help with browser refresh recovery
    localStorage.setItem('privateMode', `${newValue}`);
    dispatch(
      setBargeCoachStatus({
        privateMode: newValue,
      }),
    );

    if (!agentWorkerSID || monitoringState === 0) {
      // Don't update Sync doc if we are not monitoring anyone
      return;
    }

    if (newValue) {
      // Remove the supervisor from the Sync Doc
      SyncDoc.initSyncDocSupervisors(agentWorkerSID, conferenceSID, myWorkerSID, supervisorFN, '', 'remove');
    } else {
      // Update the Sync Doc with the appropriate supervisor and status now that private mode is off
      let supervisorStatus = 'monitoring';
      if (coaching) {
        supervisorStatus = 'coaching';
      } else if (!muted) {
        supervisorStatus = 'barge';
      }
      SyncDoc.initSyncDocSupervisors(agentWorkerSID, conferenceSID, myWorkerSID, supervisorFN, supervisorStatus, 'add');
    }
  };

  // Render the Supervisor Private Mode Button to toggle if the supervisor wishes to remain private when
  // coaching the agent

  const isLiveCall = TaskHelper.isLiveCall(task);

  return (
    <Flex hAlignContent="center" vertical padding="space30" paddingTop="space50">
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
