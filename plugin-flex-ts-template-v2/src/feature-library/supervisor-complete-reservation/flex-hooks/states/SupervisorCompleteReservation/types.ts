// Actions
export const prefix = `custom/SupervisorCompleteReservation`;
export const UPDATE_RERSERVATION = `${prefix}/UPDATE_RERSERVATION`;

// State
export interface SupervisorCompleteReservationState {
  isProcessingRequest: {
    [taskSid: string]: boolean;
  };
}
