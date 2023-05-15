export enum StringTemplates {
  FailedToLoadInsightsClient = 'PSFailedToLoaddInsightsClient',
  FailedToLoadInsightsData = 'PSFailedToLoadInsightsData',
  XWTFeatureDependencyMissing = 'PSXWTFeatureDependencyMissing',
  PhoneNumberFailedValidationCheckRequest = 'PSPhoneNumberFailedValidationCheckRequest',
  PhoneNumberFailedValidationCheckWithErrors = 'PSPhoneNumberFailedValidationCheckWithErrors',
  ErrorExecutingColdTransfer = 'PSErrorExecutingColdTransfer',
}

export const stringHook = () => ({
  [StringTemplates.FailedToLoadInsightsClient]: 'Failed to load real time insights client. All queues are listed',
  [StringTemplates.FailedToLoadInsightsData]: 'Unable to load real time insights data. All queues are listed',
  [StringTemplates.XWTFeatureDependencyMissing]:
    "The Custom Transfer Directory with external transfer is enabled but neither the native 'external warm transfer' feature or the plugins own 'conference' feature are enabled that it depends on.  As a result, warm external transfers for voice calls will be disabled",
  [StringTemplates.PhoneNumberFailedValidationCheckRequest]:
    "Failed to successfully make validation check request for phone number '{{phoneNumber}}'",
  [StringTemplates.PhoneNumberFailedValidationCheckWithErrors]:
    "The phone number '{{phoneNumber}}' failed validation check with the following errors: {{errors}}",
  [StringTemplates.ErrorExecutingColdTransfer]: 'Error attempting to perform cold transfer, {{message}}',
});
