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
import ConferenceReducer, {
  ConferenceState
} from "../../feature-library/conference/flex-hooks/states/ConferenceSlice";
import PauseRecordingReducer, {
  PauseRecordingState
} from "../../feature-library/pause-recording/flex-hooks/states/PauseRecordingSlice";
import {
  SupervisorCompleteReservationState,
  SupervisorCompleteReservationReducer,
} from "../../feature-library/supervisor-complete-reservation/flex-hooks/states/SupervisorCompleteReservation";

export interface CustomState {
  outboundCallerIdSelector: OutboundCallerIDSelectorState;
  callbackAndVoicemail: CallbackAndVoicemailState;
  supervisorBargeCoach: SupervisorBargeCoachState;
  conference: ConferenceState;
  pauseRecording: PauseRecordingState;
  supervisorCompleteReservation: SupervisorCompleteReservationState;
}

export const customReducers = {
  outboundCallerIdSelector: OutboundCallerIDSelectorReducer,
  callbackAndVoicemail: CallbackAndVoicemailReducer,
  supervisorBargeCoach: SupervisorBargeCoachReducer,
  conference: ConferenceReducer,
  pauseRecording: PauseRecordingReducer,
  supervisorCompleteReservation: SupervisorCompleteReservationReducer
};
