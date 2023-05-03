import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/CustomTransferDirectory';

export enum CustomTransferDirectoryNotification {
  FailedLoadingInsightsClient = 'FailedLoadingInsightsClient',
  FailedLoadingInsightsData = 'FailedLoadingInsightsData',
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
];
