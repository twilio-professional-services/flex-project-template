import * as Flex from '@twilio/flex-ui';
import CustomQueueTransferDirectory from '../../custom-components/CustomQueueTransferDirectory';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.override_queue_transfer_directory;

export function replaceQueueTabForChatTransfers(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  // disable ability to transfer to agent for chats or calls
  //flex.WorkerDirectory.Tabs.Content.remove('workers');

  // remove existing queues tab
  flex.WorkerDirectory.Tabs.Content.remove('queues', {
    if: (props) => Flex.TaskHelper.isChatBasedTask(props.task)
  });

  // Add new Queues tab
  flex.WorkerDirectory.Tabs.Content.add(
    <flex.Tab key="custom-transfer-directory" label="Queues">
      <CustomQueueTransferDirectory
        queueNameEnforcedFilter=""
        manager={manager}
      />
    </flex.Tab>, {
    if: (props) => Flex.TaskHelper.isChatBasedTask(props.task)
  }
  );
}

