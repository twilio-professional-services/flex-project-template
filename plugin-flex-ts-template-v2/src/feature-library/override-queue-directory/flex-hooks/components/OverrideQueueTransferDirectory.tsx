import * as Flex from '@twilio/flex-ui';
import React from 'react';
// import { isFeatureEnabled } from '../../index';
import OverrideQueueTransferDirectoryComponent from '../../custom-components/OverrideQueueTransferDirectoryComponent/';
import { isOverrideQueueTransferEnabled } from '../../index';

export function addOverrideQueueTransferDirectory(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isOverrideQueueTransferEnabled()) return;

  flex.WorkerDirectory.Tabs.Content.remove('queues');

  flex.WorkerDirectory.Tabs.Content.add(
    <flex.Tab key="custom-transfer-directory" label="Queues">
      <div id="override_queue_transfer_directory_container">
        <OverrideQueueTransferDirectoryComponent
          key="OverrideQueueTransferDirectoryComponent"
          manager={manager}
        />
      </div>
    </flex.Tab>
  );
}
