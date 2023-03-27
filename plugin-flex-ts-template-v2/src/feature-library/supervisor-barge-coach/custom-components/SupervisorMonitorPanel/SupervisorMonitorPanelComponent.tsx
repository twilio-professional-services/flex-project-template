import React, { useEffect } from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Stack, Box, Text } from '@twilio-paste/core';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoach';
// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync';

type SupervisorMonitorPanelProps = {
  icon: string;
  uniqueName: string;
};

export const SupervisorMonitorPanel = (_props: SupervisorMonitorPanelProps) => {
  const dispatch = useDispatch();

  let { supervisorArray } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );
  const { syncSubscribed } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const agentWorkerSID = useFlexSelector((state) => state?.flex?.supervisor?.stickyWorker?.worker?.sid);

  const supervisorsArray = () => {
    return supervisorArray.map((supervisorArray) => (
      <tr key={supervisorArray.supervisorSID}>
        <td>{supervisorArray.supervisor}</td>
        <td style={{ color: 'green' }}>&nbsp;{supervisorArray.status}</td>
      </tr>
    ));
  };
  const syncUpdates = () => {
    if (agentWorkerSID) {
      // Let's subscribe to the sync doc as an agent/worker and check
      // if we are being coached, if we are, render that in the UI
      // otherwise leave it blank
      const mySyncDoc = `syncDoc.${agentWorkerSID}`;
      SyncDoc.getSyncDoc(mySyncDoc).then((doc: any) => {
        // We are subscribing to Sync Doc updates here and logging anytime that happens
        doc.on('updated', (_updatedDoc: string) => {
          if (doc.data.supervisors) {
            supervisorArray = [...doc.data.supervisors];
          } else {
            supervisorArray = [];
          }

          // Set Supervisor's name that is coaching into props
          dispatch(
            Actions.setBargeCoachStatus({
              supervisorArray,
            }),
          );
        });
      });
      dispatch(
        Actions.setBargeCoachStatus({
          syncSubscribed: true,
        }),
      );
    }
  };

  useEffect(() => {
    if (!syncSubscribed) {
      syncUpdates();
    }
  });

  if (supervisorArray.length > 0) {
    return (
      <Flex hAlignContent="center" vertical padding="space40">
        <Stack orientation="horizontal" spacing="space30" element="COACH_STATUS_PANEL_BOX">
          <Box backgroundColor="colorBackgroundPrimaryWeakest">
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
    );
  }
  return (
    <Flex hAlignContent="center" vertical padding="space40">
      <Stack orientation="horizontal" spacing="space30" element="COACH_STATUS_PANEL_BOX">
        <Box backgroundColor="colorBackgroundPrimaryWeakest" padding="space40">
          Active Supervisors:
          <Box>None</Box>
        </Box>
      </Stack>
    </Flex>
  );
};
