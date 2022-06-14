// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ErrorCallingCustomer = 'PSCallbackErrorCallingCustomerNotification',
  OutboundDialingNotEnabled = 'PSCallbackOutboundDialingNotEnabledNotification'
}

export default {
  [StringTemplates.ErrorCallingCustomer]: 'Failed to call {{customer}}, please try again',
  [StringTemplates.OutboundDialingNotEnabled]: 'Outbound dialing is not enabled, please notify a systems administrator'
}
