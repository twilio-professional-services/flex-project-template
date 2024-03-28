// Actions
export const prefix = 'custom/SupervisorBargeCoach';
export const ACTION_SET_BARGE_COACH_STATUS = 'SET_BARGE_COACH_STATUS';
export const ACTION_SET_CHAT_BARGE_STATUS = 'SET_CHAT_BARGE_STATUS';

// State
export interface SupervisorBargeCoachState {
  coaching: boolean;
  enableCoachButton: boolean;
  muted: boolean;
  barge: boolean;
  enableBargeinButton: boolean;
  supervisorArray: Array<any>;
  privateMode: boolean;
  syncSubscribed: boolean;
  agentAssistanceButton: boolean;
  enableAgentAssistanceAlerts: boolean;
  agentAssistanceSyncSubscribed: boolean;
  agentAssistanceArray: Array<any>;
  chatBarge: { [key: string]: boolean };
  interactionParticipants: number;
}
