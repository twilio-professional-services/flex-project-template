import * as React from 'react';
import { TaskHelper, useFlexSelector, ITask, IconButton } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { Actions } from "../../flex-hooks/states/SupervisorBargeCoach"
import { Flex, Stack } from "@twilio-paste/core";


// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync'

type SupervisorPrivateToggleProps = {
  task: ITask
}

export const SupervisorPrivateToggle = ({task}: SupervisorPrivateToggleProps) => {
  const dispatch = useDispatch();

  const {
    barge, 
    coaching, 
    privateMode
  } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const agentWorkerSID = useFlexSelector(state => state?.flex?.supervisor?.stickyWorker?.worker?.sid);
  const myWorkerSID = useFlexSelector(state => state?.flex?.worker?.worker?.sid);
  const supervisorFN = useFlexSelector(state => state?.flex?.worker?.attributes?.full_name);

  // We will toggle the private mode on/off based on the button click and the state
  // of the coachingStatusPanel along with udpating the Sync Doc appropriately
  const togglePrivateMode = () => {
    const conference = task && task.conference;
    const conferenceSID = conference?.conferenceSid;

    // If privateMode is true, toggle to false and update the Sync Doc with the appropriate Supervisor and Status
    if (privateMode) {
      dispatch(Actions.setBargeCoachStatus({ 
        privateMode: false, 
      }));
      if (coaching) {
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "is Coaching", "add");
      } else if (barge) {
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "has Joined", "add");
      } else {
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "is Monitoring", "add");
      }
    // If privateMode is false, toggle to true and remove the Supervisor from the Sync Doc
    } else {
      dispatch(Actions.setBargeCoachStatus({ 
        privateMode: true, 
      }));
      SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "", "remove");
    }
  }

  // Render the Supervisor Private Mode Button to toggle if the supervisor wishes to remain private when
  // coaching the agent

  const isLiveCall = TaskHelper.isLiveCall(task);

  return (
    <>
      <Flex hAlignContent="center" vertical padding="space30">
        <Stack orientation="horizontal" spacing="space30" element="SUPERVISOR_PRIVATE_BUTTON_BOX">
          <IconButton
            icon={ privateMode ? 'EyeBold' : 'Eye' }
            disabled={!isLiveCall}
            onClick={togglePrivateMode}
            title={ privateMode ? "Disable Private Mode" : "Enable Private Mode" }
            variant="secondary"
          />
          { privateMode ? "Privacy On" : "Privacy Off" }
        </Stack>
      </Flex>
    </>
  );
}