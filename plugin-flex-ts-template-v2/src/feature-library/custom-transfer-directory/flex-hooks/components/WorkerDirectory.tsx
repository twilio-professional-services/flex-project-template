import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isCustomQueueTransferEnabled } from '../../config';
import QueueDirectoryTab from '../../custom-components/QueueDirectoryTab';

export const componentName = FlexComponent.WorkerDirectory;
export const componentHook = function replaceQueueDirectory(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isCustomQueueTransferEnabled) return;

  // remove existing queues tab
  flex.WorkerDirectory.Tabs.Content.remove('queues');

  // Add new Queues tab
  flex.WorkerDirectory.Tabs.Content.add(
    <flex.Tab key="override-queue-transfer-directory" label="Queues">
      <QueueDirectoryTab key="worker-directory-custom-queue-tab" />
    </flex.Tab>,
    {
      sortOrder: 1,
    },
  );
};
