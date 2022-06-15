// Actions
export const prefix = 'custom/Callback';
export const INITIATE_CALLBACK = `${prefix}/INITIATE_CALLBACK`;

// State
export interface CallbackState {
	isCompletingCallbackAction: { [taskSid: string]: boolean; };
};
