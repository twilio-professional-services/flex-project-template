// Actions
export const prefix = 'custom/Callback';
export const INITIATE_CALLBACK = `${prefix}/INITIATE_CALLBACK`;
export const REQUEUE_CALLBACK = `${prefix}/REQUEUE_CALLBACK`;

// State
export interface CallbackState {
	isCompletingCallbackAction: { [taskSid: string]: boolean; };
	isRequeueingCallbackAction: { [taskSid: string]: boolean; };
};
