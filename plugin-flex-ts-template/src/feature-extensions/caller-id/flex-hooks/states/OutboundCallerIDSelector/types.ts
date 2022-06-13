import { PhoneNumberItem } from "utils/serverless/PhoneNumbers/PhoneNumberService";

// Actions
export const prefix = 'custom/OutboundCallerIDSelector';
export const FETCH_PHONE_NUMBERS = `${prefix}/FETCH_PHONE_NUMBERS`;
export const SET_CALLER_ID = `${prefix}/SET_CALLER_ID`;

// State
export interface OutboundCallerIDSelectorState {
	isFetchingPhoneNumbers: boolean,
	fetchingPhoneNumbersFailed: boolean,
	isUpdatingAttributes: boolean,
	updatingAttributesFailed: boolean,
	phoneNumbers: Array<PhoneNumberItem>,
	selectedCallerId: string
};
