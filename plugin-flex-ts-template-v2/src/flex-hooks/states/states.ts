import {
  OutboundCallerIDSelectorState,
  OutboundCallerIDSelectorReducer,
} from "../../feature-library/caller-id/flex-hooks/states/OutboundCallerIDSelector";
import {
  CallbackAndVoicemailState,
  CallbackAndVoicemailReducer,
} from "../../feature-library/callback-and-voicemail/flex-hooks/states/CallbackAndVoicemail";
import {
  SupervisorBargeCoachState,
  SupervisorBargeCoachReducer,
} from "../../feature-library/supervisor-barge-coach/flex-hooks/states/SupervisorBargeCoach";

export interface CustomState {
  outboundCallerIdSelector: OutboundCallerIDSelectorState;
  callbackAndVoicemail: CallbackAndVoicemailState;
  supervisorBargeCoach: SupervisorBargeCoachState;
}

export const customReducers = {
  outboundCallerIdSelector: OutboundCallerIDSelectorReducer,
  callbackAndVoicemail: CallbackAndVoicemailReducer,
  supervisorBargeCoach: SupervisorBargeCoachReducer,
};
