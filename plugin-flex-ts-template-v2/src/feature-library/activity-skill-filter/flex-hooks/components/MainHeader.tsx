import * as Flex from '@twilio/flex-ui';
import ActivityWrapperComponent from '../../custom-components/activity-wrapper';
import { NotificationIds } from '../notifications/ActivitySkillFilter';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled, rules } = getFeatureFlags().features?.activity_skill_filter || {};

export function replaceActivityComponent(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;
  
  if (!rules) {
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
