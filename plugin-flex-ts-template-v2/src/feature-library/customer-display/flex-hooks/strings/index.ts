/**
 * Customer Display - Localized Strings
 */

export const strings = {
  customerDetailsHeading: 'Customer Details',
  loadingMessage: 'Loading customer details...',
  errorHeading: 'Failed to load customer details',
  noRecordMessage: 'No customer record found',
  retryButtonLabel: 'Retry',
  fullNameLabel: 'Full Name',
  accountNameLabel: 'Account Name',
  lastInteractionDateLabel: 'Last Interaction Date',
  openCasesLabel: 'Open Cases',
};

export const stringHook = function useCustomerDisplayStrings() {
  return { strings };
};
