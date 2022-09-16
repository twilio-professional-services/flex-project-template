import React from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { Actions } from "../../flex-hooks/states/SupervisorBargeCoach"
import { Flex, Stack, Box, Text } from "@twilio-paste/core";

// Import to get Sync Doc updates
import { SyncDoc } from '../../utils/sync/Sync'

type CoachingStatusPanelProps = {
}

export const CoachingStatusPanel = ({}: CoachingStatusPanelProps) => {
  const dispatch = useDispatch();

  let {
    supervisorArray,
    syncSubscribed
  } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);
 
  const myWorkerSID = useFlexSelector(state => state?.flex?.worker?.worker?.sid);

  const syncUpdates = () => {
    if (syncSubscribed != true) {
      // Let's subscribe to the sync doc as an agent/work and check
      // if we are being coached, if we are, render that in the UI
      // otherwise leave it blank
      const mySyncDoc = `syncDoc.${myWorkerSID}`;
      
      SyncDoc.getSyncDoc(mySyncDoc)
      .then(doc => {
        // We are subscribing to Sync Doc updates here and logging anytime that happens
        doc.on("updated", (updatedDoc: string) => {
          if (doc.data.supervisors != null) {
            supervisorArray = [...doc.data.supervisors];
            // Current verion of this feature will only show the Agent they are being coached
            // This could be updated by removing the below logic and including Monitoring and Joined (barged)
            for(let i = 0; i < supervisorArray.length; i++){ 
                                    
              if (supervisorArray[i].status == "is Monitoring" || supervisorArray[i].status == "has Joined") { 
                  supervisorArray.splice(i, 1); 
                  i--; 
              }
            }
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

  // If the supervisor array has value in it, that means someone is coaching
  // We will map each of the supervisors that may be actively coaching
  // Otherwise we will not display anything if no one is actively coaching
  if (supervisorArray.length != 0) {

    return (
      <>
        <Flex hAlignContent="center" vertical>
          <Stack orientation="horizontal" spacing="space30" element="COACH_STATUS_PANEL_BOX">
            <Box backgroundColor="colorBackgroundPrimaryWeakest" padding="space40">
              You are being Coached by: 
              <Box>
                <ol>
                  <Text
                  as="p"
                  fontWeight="fontWeightMedium"
                  fontSize="fontSize30"
                  marginBottom="space40"
                  color="colorTextSuccess"
                  >
                    {supervisorArray.map((supervisorArray: { supervisor: {} }) => (
                        <li key={`${Math.random()}`}>{supervisorArray.supervisor}</li>
                    ))}
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
      <></>
    );
  }
}