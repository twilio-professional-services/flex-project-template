import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/CustomTransferDirectory';

export enum CustomTransferDirectoryNotification {
  FailedLoadingInsightsClient = 'FailedLoadingInsightsClient',
  FailedLoadingInsightsData = 'FailedLoadingInsightsData',
  XWTFeatureDependencyMissing = 'XWTFeatureDependencyMissing',
  PhoneNumberFailedValidationCheckRequest = 'PhoneNumberFailedValidationCheckRequest',
  PhoneNumberFailedValidationCheckWithErrors = 'PhoneNumberFailedValidationCheckWithErrors',
  ErrorExecutingColdTransfer = 'ErrorExecutingColdTransfer',
}

export const notificationHook = (flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: CustomTransferDirectoryNotification.FailedLoadingInsightsClient,
    timeout: 5000,
    content: StringTemplates.FailedToLoadInsightsClient,
    type: flex.NotificationType.warning,
  },
  {
    id: CustomTransferDirectoryNotification.FailedLoadingInsightsData,
    timeout: 5000,
    content: StringTemplates.FailedToLoadInsightsData,
    type: flex.NotificationType.warning,
  },
  {
    id: CustomTransferDirectoryNotification.XWTFeatureDependencyMissing,
    timeout: 30000,
    content: StringTemplates.XWTFeatureDependencyMissing,
    type: flex.NotificationType.warning,
  },
  {
    id: CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckRequest,
    timeout: 5000,
    content: StringTemplates.PhoneNumberFailedValidationCheckRequest,
    type: flex.NotificationType.error,
  },
  {
    id: CustomTransferDirectoryNotification.PhoneNumberFailedValidationCheckWithErrors,
    timeout: 5000,
    content: StringTemplates.PhoneNumberFailedValidationCheckWithErrors,
    type: flex.NotificationType.error,
  },
  {
    id: CustomTransferDirectoryNotification.ErrorExecutingColdTransfer,
    timeout: 5000,
    content: StringTemplates.ErrorExecutingColdTransfer,
    type: flex.NotificationType.error,
  },
];
