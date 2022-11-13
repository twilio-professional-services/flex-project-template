import * as Flex from '@twilio/flex-ui';
import ActivitySkillFilter from '../../feature-library/activity-skill-filter/flex-hooks/strings/ActivitySkillFilter'
import Callback from '../../feature-library/callbacks/flex-hooks/strings/Callback'
import ChatTransfer from '../../feature-library/chat-transfer/flex-hooks/strings/ChatTransfer'
import ActivityHandler from '../../feature-library/activity-reservation-handler/flex-hooks/strings/ActivityReservationHandler'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    // -v- Add custom strings here -v-
    ...ActivitySkillFilter,
    ...Callback,
    ...ChatTransfer,
    ...ActivityHandler,
    // -^---------------------------^-

    ...manager.strings,

    // -v- Modify strings provided by flex here -v-
    //WorkerDirectoryAgentsTabLabel: '<span style="font-size: 10px;">Agents</span>',
    //WorkerDirectoryQueuesTabLabel: '<span style="font-size: 10px;">Queues</span>',
    // -^----------------------------------------^-
  } as any;
}