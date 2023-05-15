import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isCustomQueueTransferEnabled, isExternalDirectoryEnabled } from '../../config';
import QueueDirectoryTab from '../../custom-components/QueueDirectoryTab';
import ExternalDirectoryTab from '../../custom-components/ExternalDirectoryTab';

export const componentName = FlexComponent.WorkerDirectory;
export const componentHook = function replaceQueueDirectory(flex: typeof Flex, _manager: Flex.Manager) {
  if (isCustomQueueTransferEnabled()) {
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
  }

  if (isExternalDirectoryEnabled()) {
    // Add External tab for voice calls only
    flex.WorkerDirectory.Tabs.Content.add(
      <flex.Tab key="external-transfer-directory" label="External">
        <ExternalDirectoryTab key="worker-directory-custom-external-tab" />
      </flex.Tab>,
      {
        sortOrder: 1,
        if: (props) => Flex.TaskHelper.isCallTask(props.task),
      },
    );
  }
};
