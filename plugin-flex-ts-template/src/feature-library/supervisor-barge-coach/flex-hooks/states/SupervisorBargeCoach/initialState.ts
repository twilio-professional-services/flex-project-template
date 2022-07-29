import { SupervisorBargeCoachState } from './types';

// Set the initial state of the below that we will use to change the buttons and UI
const initialState: SupervisorBargeCoachState = {
    coaching: false,
    enableCoachButton: false,
    muted: true,
    barge: false,
    enableBargeinButton: false,
    supervisorArray: [],
    coachingStatusPanel: true
};

export default initialState;
  