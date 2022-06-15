import * as Flex from '@twilio/flex-ui';
import ChatTransfer from '../../feature-library/chat-transfer/flex-hooks/strings/ChatTransfer'
import Callback from '../../feature-library/callbacks/flex-hooks/strings/Callback'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    // -v- Add custom strings here -v-
    ...ChatTransfer,
    ...Callback,
    // -^---------------------------^-

    ...manager.strings,

    // -v- Modify strings provided by flex here -v-
    //WorkerDirectoryAgentsTabLabel: '<span style="font-size: 10px;">Agents</span>',
    //WorkerDirectoryQueuesTabLabel: '<span style="font-size: 10px;">Queues</span>',
    // -^----------------------------------------^-
  } as any;
}
