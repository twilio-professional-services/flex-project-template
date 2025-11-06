import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isCustomQueueTransferEnabled, isCustomWorkerTransferEnabled, isExternalDirectoryEnabled } from '../../config';
import WorkerDirectoryTab from '../../custom-components/WorkerDirectoryTab';
import QueueDirectoryTab from '../../custom-components/QueueDirectoryTab';
import ExternalDirectoryTab from '../../custom-components/ExternalDirectoryTab';
import { StringTemplates } from '../strings/CustomTransferDirectory';

const WorkersTab = (props: any) => {
  return (
    <Flex.Tab key="override-workers-transfer-directory" label={props.label}>
      <WorkerDirectoryTab key="worker-directory-custom-workers-tab" workers={props.workers} />
    </Flex.Tab>
  );
};

const QueuesTab = (props: any) => {
  return (
    <Flex.Tab key="override-workers-transfer-directory" label={props.label}>
      <QueueDirectoryTab key="worker-directory-custom-queue-tab" queues={props.queues} />
    </Flex.Tab>
  );
};

export const componentName = FlexComponent.WorkerDirectory;
export const componentHook = function replaceQueueDirectory(flex: typeof Flex, manager: Flex.Manager) {
  if (isCustomWorkerTransferEnabled()) {
    // remove existing workers tab
    flex.WorkerDirectory.Tabs.Content.remove('workers');

    // Add new workers tab
    flex.WorkerDirectory.Tabs.Content.add(
      <WorkersTab key="worker-directory-custom-workers-tab" label={manager.strings.AgentPanelTitle} />,
      {
        sortOrder: 0,
      },
    );
  }

  if (isCustomQueueTransferEnabled()) {
    // remove existing queues tab
    flex.WorkerDirectory.Tabs.Content.remove('queues');

    // Add new Queues tab
    flex.WorkerDirectory.Tabs.Content.add(
      <QueuesTab key="override-queue-transfer-directory" label={(manager.strings as any)[StringTemplates.Queues]} />,
      {
        sortOrder: 1,
      },
    );
  }

  if (isExternalDirectoryEnabled()) {
    // Add External tab for voice calls only
    flex.WorkerDirectory.Tabs.Content.add(
      <flex.Tab key="external-transfer-directory" label={(manager.strings as any)[StringTemplates.External]}>
        <ExternalDirectoryTab key="worker-directory-custom-external-tab" />
      </flex.Tab>,
      {
        sortOrder: 1,
        if: (props) => Flex.TaskHelper.isCallTask(props.task),
      },
    );
  }
};
