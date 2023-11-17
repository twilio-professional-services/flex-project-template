import { withTaskContext, Manager, Actions, ITask, TaskHelper, Icon, templates } from '@twilio/flex-ui';
import { Worker } from 'twilio-taskrouter';
import { useEffect, useState } from 'react';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { Avatar } from '@twilio-paste/core/avatar';
import { UserIcon } from '@twilio-paste/icons/esm/UserIcon';

import { showOnlyAvailableWorkers, isCbmColdTransferEnabled, isCbmWarmTransferEnabled } from '../config';
import { DirectoryEntry } from '../types/DirectoryEntry';
import DirectoryTab from './DirectoryTab';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';

export interface TransferClickPayload {
  mode: 'WARM' | 'COLD';
}

export interface OwnProps {
  task: ITask;
}

const QueueDirectoryTab = (props: OwnProps) => {
  const [fetchedWorkers, setFetchedWorkers] = useState([] as Array<Worker>);
  const [filteredWorkers, setFilteredWorkers] = useState([] as Array<DirectoryEntry>);
  const [isLoading, setIsLoading] = useState(true);

  const { workspaceClient, workerClient } = Manager.getInstance();

  const callWarmTransferEnabled =
    Manager.getInstance().store.getState().flex.featureFlags.features['flex-warm-transfers']?.enabled;

  const isWarmTransferEnabled =
    props.task && TaskHelper.isCBMTask(props.task) ? isCbmWarmTransferEnabled() : callWarmTransferEnabled;
  const isColdTransferEnabled = props.task && TaskHelper.isCBMTask(props.task) ? isCbmColdTransferEnabled() : true;

  // async function to retrieve the workers from the tr sdk
  // this will trigger the useEffect for a fetchedWorkers update
  const fetchSDKWorkers = async () => {
    if (!workspaceClient) {
      return;
    }
    setFetchedWorkers(Array.from((await workspaceClient.fetchWorkers()).values()) as unknown as Array<Worker>);
  };

  // function to filter the generatedQueueList and trigger a re-render
  const filterWorkers = () => {
    const updatedWorkers = fetchedWorkers
      .filter((worker) => {
        if (worker.sid === workerClient?.workerSid) {
          return false;
        }
        if (showOnlyAvailableWorkers()) {
          // returning only available workers
          return worker.available;
        }
        return worker;
      })
      .sort((a: Worker, b: Worker) =>
        (a.attributes?.full_name ?? a.name) > (b.attributes?.full_name ?? b.name) ? 1 : -1,
      )
      .map(
        (worker) =>
          ({
            cold_transfer_enabled: isColdTransferEnabled && worker.available,
            warm_transfer_enabled: isWarmTransferEnabled && worker.available,
            label: worker.attributes?.full_name ?? worker.name,
            labelComponent: (
              <Stack orientation="vertical" spacing="space0">
                <Text as="div" element="TRANSFER_DIR_COMMON_ROW_NAME">
                  {worker.attributes?.full_name ?? worker.name}
                </Text>
                <Stack orientation="horizontal" spacing="space0">
                  <Icon icon={worker.available ? 'GreenIndicator' : 'GreyIndicator'} sizeMultiplier={0.5} />
                  <Text as="div" element="TRANSFER_DIR_COMMON_ROW_DESC">
                    {(worker as any).activityName}
                  </Text>
                </Stack>
              </Stack>
            ),
            icon: (
              <Avatar
                size="sizeIcon60"
                color="decorative10"
                icon={UserIcon}
                name={worker.attributes?.full_name ?? worker.name}
                src={worker.attributes?.image_url}
              />
            ),
            address: worker.sid,
            type: 'worker',
          } as DirectoryEntry),
      );

    setFilteredWorkers(updatedWorkers);
  };

  const onTransferClick = (entry: DirectoryEntry, transferOptions: TransferClickPayload) => {
    Actions.invokeAction('TransferTask', {
      task: props.task,
      targetSid: entry.address,
      options: transferOptions,
    });
  };

  // initial render
  useEffect(() => {
    // fetch the workers from the taskrouter sdk on initial render
    fetchSDKWorkers().catch(console.error);
  }, []);

  useEffect(() => {
    filterWorkers();
  }, [fetchedWorkers]);

  useEffect(() => {
    if (fetchedWorkers.length > 0) {
      setIsLoading(false);
    }
  }, [filteredWorkers]);

  return (
    <DirectoryTab
      entries={filteredWorkers}
      isLoading={isLoading}
      onTransferClick={onTransferClick}
      noEntriesMessage={templates[StringTemplates.NoAgentsAvailable]}
    />
  );
};

export default withTaskContext(QueueDirectoryTab);
