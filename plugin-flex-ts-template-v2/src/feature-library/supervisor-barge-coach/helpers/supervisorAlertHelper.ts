import { AppState, reduxNamespace } from '../../../flex-hooks/states'
import * as Flex from "@twilio/flex-ui";
import { Actions } from "../flex-hooks/states/SupervisorBargeCoach"
import { registerNotificaiton, showNotificaiton, registeredNotifications } from '../flex-hooks/notifications/BargeCoachAssist'
import { SyncDoc } from '../utils/sync/Sync';

// When this is called, we will do checks to validate any new agents that need assistance
export const alertSupervisorsCheck = () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  const {
    agentAssistanceArray
  } = state[reduxNamespace].supervisorBargeCoach;
  let arrayIndexCheck = agentAssistanceArray.findIndex((agent) => agent.agentFN != "");
  if (arrayIndexCheck > -1) {
    let agentFN = `${agentAssistanceArray[arrayIndexCheck].agentFN}`;
    // Registering the notification with the ID being the Agent's full name and alert string as content
    registerNotificaiton(agentFN);
    // Fire off the Notification we just registered
    showNotificaiton(agentFN);
    // Delete the alert, the alert will still show in the UI but this gives the ability
    // if the agent happens to toggle assistance off/on again, that a new alert will pop up
    registeredNotifications(agentFN);
  }
  return;
}
  
export const syncUpdates = async () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  const {
    enableAgentAssistanceAlerts,
    agentAssistanceSyncSubscribed
  } = state[reduxNamespace].supervisorBargeCoach;

  if(enableAgentAssistanceAlerts && !agentAssistanceSyncSubscribed) {
    SyncDoc.getSyncDoc('Agent-Assistance')
    .then(doc => {
      // Update the redux store/state with the latest array of agents needing assistance
      Flex.Manager.getInstance().store.dispatch(Actions.setBargeCoachStatus({ 
        agentAssistanceArray: doc.data.agentAssistance
      }));
      updateTaskAndTriggerAlerts();

      // We are subscribing to Sync Doc updates here and logging anytime that happens
      doc.on("updated", (doc: any) => {
        // Every time we get an update on the Sync Doc, update the redux store/state
        // with the latest array of agents needing assistance
        Flex.Manager.getInstance().store.dispatch(Actions.setBargeCoachStatus({ 
          agentAssistanceArray: doc.data.agentAssistance
        }));
        updateTaskAndTriggerAlerts();
      })
    })
    // Setting agentAssistanceSyncSubscribed to true so we don't attempt more sync update/subscribes
    Flex.Manager.getInstance().store.dispatch(Actions.setBargeCoachStatus({ 
      agentAssistanceSyncSubscribed: true
    }));
  }
  return;
}

export const updateTaskAndTriggerAlerts = () => {
  const state = Flex.Manager.getInstance().store.getState() as AppState;
  const {
    agentAssistanceArray,
    enableAgentAssistanceAlerts,
  } = state[reduxNamespace].supervisorBargeCoach;

  let arrayIndexCheck = agentAssistanceArray?.findIndex((agent: any) => agent.agentFN != "");
  // Confirm Alerts are enabled and there are agents activity seeking assistance
  if(enableAgentAssistanceAlerts && arrayIndexCheck > -1) {
    // Call the alert check function to alert for any new agents needing assistance
    alertSupervisorsCheck();
  }
  return;
}