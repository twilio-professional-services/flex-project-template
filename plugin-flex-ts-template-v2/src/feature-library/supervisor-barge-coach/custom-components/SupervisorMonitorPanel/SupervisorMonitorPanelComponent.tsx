import * as React from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { Actions } from "../../flex-hooks/states/SupervisorBargeCoach"
import { Flex, Stack, Box, Text } from "@twilio-paste/core";

// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync'

type SupervisorMonitorPanelProps = {
  icon: string,
  uniqueName: string
}

export const SupervisorMonitorPanel = ({}: SupervisorMonitorPanelProps) => {
  const dispatch = useDispatch();

  let {
    supervisorArray,
    syncSubscribed
  } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);
 
  const agentWorkerSID = useFlexSelector(state => state?.flex?.supervisor?.stickyWorker?.worker?.sid);
 
 const supervisorsArray = () => {
    
    return (
      supervisorArray.map(supervisorArray => (
        <tr key={supervisorArray.supervisorSID}>
          <td>{supervisorArray.supervisor}</td>
          <td style={{ "color": 'green' }}>&nbsp;{supervisorArray.status}</td>
        </tr>
      ))
    )
 }
 const syncUpdates = () => {

  if (agentWorkerSID != null && syncSubscribed != true) {

    // Let's subscribe to the sync doc as an agent/worker and check
    // if we are being coached, if we are, render that in the UI
    // otherwise leave it blank
    const mySyncDoc = `syncDoc.${agentWorkerSID}`;
    SyncDoc.getSyncDoc(mySyncDoc)
    .then(doc => {
      // We are subscribing to Sync Doc updates here and logging anytime that happens
      doc.on("updated", (updatedDoc: string) => {
        if (doc.data.supervisors != null) {
          supervisorArray = [...doc.data.supervisors];
        } else {
          supervisorArray = [];
        }

        // Set Supervisor's name that is coaching into props
        dispatch(Actions.setBargeCoachStatus({ 
          supervisorArray: supervisorArray
        }));
      })
    });
    dispatch(Actions.setBargeCoachStatus({ 
      syncSubscribed: true,
    }));
  }
    
   return;
 }

  syncUpdates();
  
  if (supervisorArray.length != 0) {
    return (
      <>
        <Flex hAlignContent="center" vertical>
          <Stack orientation="horizontal" spacing="space30" element="COACH_STATUS_PANEL_BOX">
            <Box backgroundColor="colorBackgroundPrimaryWeakest" padding="space40">
              Active Supervisors:
              <Box>
                <ol>
                  <Text
                  as="p"
                  fontWeight="fontWeightMedium"
                  fontSize="fontSize30"
                  marginBottom="space40"
                  color="colorTextSuccess"
                  >
                    {supervisorsArray()}
                  </Text>
                </ol>
              </Box>
            </Box>
          </Stack>
        </Flex>
      </>
    );
  } else {
    return (
      <>
        <Flex hAlignContent="center" vertical>
          <Stack orientation="horizontal" spacing="space30" element="COACH_STATUS_PANEL_BOX">
            <Box backgroundColor="colorBackgroundPrimaryWeakest" padding="space40">
              Active Supervisors:
              <Box>
                None
              </Box>
            </Box>
          </Stack>
        </Flex>
      </>
    );
  }
}