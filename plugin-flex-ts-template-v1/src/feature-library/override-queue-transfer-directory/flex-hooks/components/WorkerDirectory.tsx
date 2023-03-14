import * as Flex from '@twilio/flex-ui';
import CustomQueueTransferDirectory from '../../custom-components/CustomQueueTransferDirectory';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.override_queue_transfer_directory;


export function staffOnly(flex: typeof Flex, manager: Flex.Manager) {

  flex.WorkerDirectory.Tabs.Content.remove('queues');

  flex.WorkerDirectoryTabs.defaultProps
  .hiddenWorkerFilter = 'data.attributes.roles CONTAINS "admin"';

};


