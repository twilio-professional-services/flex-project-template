import * as Flex from '@twilio/flex-ui';
import ActivitySkillFilter from '../../feature-library/activity-skill-filter/flex-hooks/notifications/ActivitySkillFilter'
import Callback from '../../feature-library/callbacks/flex-hooks/notifications/Callback'
import ChatTransfer from '../../feature-library/chat-transfer/flex-hooks/notifications/ChatTransfer'
import ActivityReservationHandler from '../../feature-library/activity-reservation-handler/flex-hooks/notifications/ActivityReservationHandler'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  ActivitySkillFilter(flex, manager);
  Callback(flex, manager);
  ChatTransfer(flex, manager);
  ActivityReservationHandler(flex, manager)
}