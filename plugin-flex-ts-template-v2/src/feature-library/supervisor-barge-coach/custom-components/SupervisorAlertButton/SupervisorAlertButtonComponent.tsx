import React, { useEffect } from "react";
import { ITask } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { Actions } from "../../flex-hooks/states/SupervisorBargeCoach"
import { Switch, Flex, Tooltip } from "@twilio-paste/core";
import { updateTaskAndTriggerAlerts, syncUpdates } from "../../helpers/supervisorAlertHelper"

type SupervisorAlertButton = {
  task: ITask
}

export const SupervisorAlertButton = ({task}: SupervisorAlertButton) => {
  const dispatch = useDispatch();

  const {
    enableAgentAssistanceAlerts,
    agentAssistanceSyncSubscribed
  } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const agentAssistanceAlertToggle = () => {
    if (enableAgentAssistanceAlerts) {
      dispatch(Actions.setBargeCoachStatus({ 
        enableAgentAssistanceAlerts: false
      }));
      // If the supervisor disabled the agent assistance alerts, let's cache this
      // to ensure it is set to false if a browser refresh happens
      console.log('Storing enableAgentAssistanceAlerts to cache');
      localStorage.setItem('cacheAlerts',"false");
    } else {
      dispatch(Actions.setBargeCoachStatus({ 
        enableAgentAssistanceAlerts: true
      }));
      updateTaskAndTriggerAlerts();
      console.log('Storing enableAgentAssistanceAlerts to cache');
      localStorage.setItem('cacheAlerts',"true");
    }
  }

  useEffect(() => {
    if(!agentAssistanceSyncSubscribed){
      syncUpdates();
    }
  });
  // Return the Supervisor Agent Assistance Toggle, this gives the supervisor
  // the option to enable or disable Agent Assistance Alerts
  return (
    <>
      <Tooltip text={enableAgentAssistanceAlerts ? "Agent Assistance Alerts Enabled" : "Agent Assistance Alerts Disabled"} placement="right">
        <Flex vAlignContent="center">
          <Switch
            checked={enableAgentAssistanceAlerts} 
            onChange={() => agentAssistanceAlertToggle()}
          >
            {""}
          </Switch>
        </Flex>
       </Tooltip>
    </>
  );

}