import * as Flex from '@twilio/flex-ui';
import ActivitySkillFilter from '../../feature-library/activity-skill-filter/flex-hooks/strings/ActivitySkillFilter'
import Callback from '../../feature-library/callbacks/flex-hooks/strings/Callback'
import ChatTransfer from '../../feature-library/chat-transfer/flex-hooks/strings/ChatTransfer'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    // -v- Add custom strings here -v-
    ...ActivitySkillFilter,
    ...Callback,
    ...ChatTransfer,
    // -^---------------------------^-

    ...manager.strings,

    // -v- Modify strings provided by flex here -v-
    //WorkerDirectoryAgentsTabLabel: '<span style="font-size: 10px;">Agents</span>',
    //WorkerDirectoryQueuesTabLabel: '<span style="font-size: 10px;">Queues</span>',
    // -^----------------------------------------^-
  } as any;
}