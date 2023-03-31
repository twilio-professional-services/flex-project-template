import * as Flex from '@twilio/flex-ui';

import ActivityWrapperComponent from '../../custom-components/activity-wrapper';
import { NotificationIds } from '../notifications/ActivitySkillFilter';
import { getRules } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function replaceActivityComponent(flex: typeof Flex, _manager: Flex.Manager) {
  if (!getRules()) {
    Flex.Notifications.showNotification(NotificationIds.ActivitySkillRulesNotConfigured);
    return;
  }

  flex.MainHeader.Content.remove('activity');
  flex.MainHeader.Content.add(<ActivityWrapperComponent key="activity-wrapper" />, {
    sortOrder: 2,
    align: 'end',
  });
};
