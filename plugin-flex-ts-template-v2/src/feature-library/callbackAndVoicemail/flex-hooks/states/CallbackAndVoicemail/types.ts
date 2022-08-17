// Actions
export const prefix = 'custom/CallbackAndVoicemail';
export const INITIATE_CALLBACK = `${prefix}/INITIATE_CALLBACK`;
export const REQUEUE_CALLBACK = `${prefix}/REQUEUE_CALLBACK`;
export const PLACED_CALLBACK = `${prefix}/PLACED_CALLBACK`;

// State
export interface CallbackAndVoicemailState {
	isCompletingCallbackAction: { [taskSid: string]: boolean; };
	isRequeueingCallbackAction: { [taskSid: string]: boolean; };
	lastPlacedReservationSid?: string;
};
