import * as Flex from '@twilio/flex-ui';
import CustomUserControlsContainer from '../../custom-components/custom-user-controls'
import { NotificationIds } from '../notifications/ActivitySkillFilter'
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled, rules } = custom_data.features.activity_skill_filter;

export function replaceUserControls(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;
  
  if (!rules) {
    Flex.Notifications.showNotification(NotificationIds.ActivitySkillRulesNotConfigured);
    return;
  }
  
  flex.MainHeader.Content.remove('user-controls');
  flex.MainHeader.Content.add(
    <CustomUserControlsContainer key="custom-user-controls" />,
      {
        sortOrder: 2,
        align: 'end'
      }
  );
}
