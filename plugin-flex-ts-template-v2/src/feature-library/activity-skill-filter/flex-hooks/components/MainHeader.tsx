import * as Flex from '@twilio/flex-ui';
import ActivityWrapperComponent from '../../custom-components/activity-wrapper';
import { NotificationIds } from '../notifications/ActivitySkillFilter';
import { isFeatureEnabled, getRules } from '../..';

export function replaceActivityComponent(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!isFeatureEnabled()) return;
  
  if (!getRules()) {
    Flex.Notifications.showNotification(NotificationIds.ActivitySkillRulesNotConfigured);
    return;
  }
  
  flex.MainHeader.Content.remove('activity');
  flex.MainHeader.Content.add(
    <ActivityWrapperComponent key="activity-wrapper" />,
      {
        sortOrder: 2,
        align: 'end'
      }
  );
}
