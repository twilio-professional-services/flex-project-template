import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum SalesforceIntegrationNotification {
  AssociationRequired = 'PSSalesforceAssociationRequired',
  AlreadyOnPhone = 'PSSalesforceAlreadyOnPhone',
}

// Return an array of Flex.Notification
export const notificationHook = () => [
  {
    id: SalesforceIntegrationNotification.AssociationRequired,
    type: Flex.NotificationType.error,
    content: StringTemplates.AssociationRequired,
    timeout: 3500,
  },
  {
    id: SalesforceIntegrationNotification.AlreadyOnPhone,
    type: Flex.NotificationType.error,
    content: StringTemplates.AlreadyOnPhone,
    timeout: 3500,
  },
];
