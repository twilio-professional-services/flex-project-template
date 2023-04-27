import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/CustomTransferDirectory';

export enum CustomTransferDirectoryNotification {
  FailedLoadingInsightsClient = 'FailedLoadingInsightsClient',
  FailedLoadingInsightsData = 'FailedLoadingInsightsData',
}

export const notificationHook = (flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: CustomTransferDirectoryNotification.FailedLoadingInsightsClient,
    content: StringTemplates.FailedToLoadInsightsClient,
    type: flex.NotificationType.warning,
  },
  {
    id: CustomTransferDirectoryNotification.FailedLoadingInsightsData,
    content: StringTemplates.FailedToLoadInsightsData,
    type: flex.NotificationType.warning,
  },
];
