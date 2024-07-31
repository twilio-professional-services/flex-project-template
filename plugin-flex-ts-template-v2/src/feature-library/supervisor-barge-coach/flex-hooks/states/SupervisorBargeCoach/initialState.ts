import { SupervisorBargeCoachState } from './types';

// Set the initial state of the below that we will use to change the buttons and UI
const initialState: SupervisorBargeCoachState = {
  coaching: false,
  muted: true,
  barge: false,
  supervisorArray: [],
  privateMode: false,
  syncSubscribed: false,
  agentAssistanceButton: false,
  agentAssistanceSyncSubscribed: false,
  enableAgentAssistanceAlerts: true,
  agentAssistanceArray: [],
};

export default initialState;
