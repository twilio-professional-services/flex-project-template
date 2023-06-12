// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  CompleteTooltip = 'PSCompleteReservationTooltip',
  ConfirmationHeader = 'PSCompleteReservationConfirmationHeader',
  ConfirmationDescription = 'PSCompleteReservationConfirmationDescription',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.CompleteTooltip]: 'Remotely complete the task reservation on behalf of the agent',
    [StringTemplates.ConfirmationHeader]: 'Complete Task Reservation',
    [StringTemplates.ConfirmationDescription]: 'Are you sure you want to force complete this reservation?',
  },
});
