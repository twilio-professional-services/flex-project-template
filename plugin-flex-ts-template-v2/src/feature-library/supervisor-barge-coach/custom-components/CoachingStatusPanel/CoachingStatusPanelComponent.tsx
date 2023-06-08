import React, { useEffect } from 'react';
import { useFlexSelector, Template, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Stack, Box, Text } from '@twilio-paste/core';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoach';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
// Import to get Sync Doc updates
import { SyncDoc } from '../../utils/sync/Sync';

export const CoachingStatusPanel = () => {
  const dispatch = useDispatch();

  let { supervisorArray } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );
  const { syncSubscribed } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const myWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid);

  const syncUpdates = () => {
    // Let's subscribe to the sync doc as an agent/work and check
    // if we are being coached, if we are, render that in the UI
    // otherwise leave it blank
    const mySyncDoc = `syncDoc.${myWorkerSID}`;
    SyncDoc.getSyncDoc(mySyncDoc).then((doc: any) => {
      // We are subscribing to Sync Doc updates here and logging anytime that happens
      doc.on('updated', (doc: any) => {
        if (doc.data.supervisors) {
          supervisorArray = [...doc.data.supervisors];
          // Current verion of this feature will only show the Agent they are being coached
          // This could be updated by removing the below logic and including Monitoring and Joined (barged)
          for (let i = 0; i < supervisorArray.length; i++) {
            if (supervisorArray[i].status === 'is Monitoring' || supervisorArray[i].status === 'has Joined') {
              supervisorArray.splice(i, 1);
              i -= 1;
            }
          }
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
  };

  useEffect(() => {
    if (!syncSubscribed) {
      syncUpdates();
      // Caching this if the browser is refreshed while the agent actively on a call
      // We will use this to clear up the Sync Doc upon browser refresh
      localStorage.setItem('myWorkerSID', `${myWorkerSID}`);
    }
  });

  // If the supervisor array has value in it, that means someone is coaching
  // We will map each of the supervisors that may be actively coaching
  // Otherwise we will not display anything if no one is actively coaching
  if (supervisorArray.length !== 0) {
    return (
      <Flex hAlignContent="center" vertical padding="space40">
        <Stack orientation="horizontal" spacing="space30" element="COACH_STATUS_PANEL_BOX">
          <Box backgroundColor="colorBackgroundPrimaryWeakest" padding="space40">
            <Template source={templates[StringTemplates.AgentCoachedBy]} />
            <Box>
              <ol>
                <Text
                  as="p"
                  fontWeight="fontWeightMedium"
                  fontSize="fontSize30"
                  marginBottom="space40"
                  color="colorTextSuccess"
                >
                  {supervisorArray.map((supervisorArray: { supervisor: string }) => (
                    <li key={`${Math.random()}`}>{supervisorArray.supervisor}</li>
                  ))}
                </Text>
              </ol>
            </Box>
          </Box>
        </Stack>
      </Flex>
    );
  }
  return <></>;
};
