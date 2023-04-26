import { Flex, Stack } from '@twilio-paste/core';
import {
  withTaskContext,
  Manager,
  IQueue,
  ClientManagerInstance,
  ClientManagerHelpers,
  Actions,
  ITask,
} from '@twilio/flex-ui';
import { useEffect, useState } from 'react';

import { getAllSyncMapItems } from '../../../utils/sdk-clients/sync/SyncClient';
import { SearchBox } from './CommonDirectoryComponents';
import { QueueItem } from './QueueItem';
import { showOnlyQueuesWithAvailableWorkers } from '../config';

export interface IRealTimeQueueData {
  total_tasks: number | null;
  longest_task_waiting_age: number | null;
  tasks_by_status: {
    wrapping: number;
    reserved: number;
    pending: number;
    assigned: number;
  } | null;
  total_eligible_workers: number | null;
  total_available_workers: number | null;
}

export interface TransferQueue extends IQueue, IRealTimeQueueData {}

export interface TransferClickPayload {
  mode: 'WARM' | 'COLD';
}

export interface OwnProps {
  task: ITask;
}

export interface MapItem {
  data: object | IRealTimeQueueData;
  key: string;
}

const QueueDirectoryTab = (props: OwnProps) => {
  const [fetchedQueues, setFetchedQueues] = useState([] as Array<IQueue>);
  const [insightsQueues, setInsightsQueues] = useState([] as Array<MapItem>);
  const [queues, setQueues] = useState([] as Array<TransferQueue>);
  const [queueFilter, setQueueFilter] = useState('');
  const [queueFilterTimer, setQueueFiltertimer] = useState(null as number | null);

  const { workspaceClient, insightsClient } = Manager.getInstance();

  // takes the input in the search box and applies it to the queue result
  const onQueueSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fetchedQueues || queueFilterTimer) {
      return;
    }

    setQueueFiltertimer(
      window.setTimeout(() => {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (event.target != null) {
          setQueueFilter(event.target.value);
          // clearTimeout(queueFilterTimer);
          setQueueFiltertimer(null);
        }
      }, 300),
    );
  };

  // async function to retrieve the task queues from the tr sdk
  const fetchSDKTaskQueues = async () => {
    if (workspaceClient)
      setFetchedQueues(
        Array.from(
          (
            await workspaceClient.fetchTaskQueues({
              Ordering: 'DateUpdated:desc',
            })
          ).values(),
        ) as unknown as Array<IQueue>,
      );
  };

  // async function to retrieve queues from the insights client with
  // agent availability - it shoould be noted the insights client acts
  // like a cache and can go stale if account is not active
  // to restore the cache, tasks need to be pushed into the queue
  const fetchInsightsQueueData = async () => {
    if (
      !ClientManagerInstance.InsightsClient ||
      ClientManagerHelpers.isForcedDegraded(ClientManagerInstance.InsightsClient)
    ) {
      return;
    }

    const queues = await getAllSyncMapItems(
      await insightsClient.map({
        id: 'realtime_statistics_v1',
        mode: 'open_existing',
      }),
    );

    setInsightsQueues(queues);
  };

  // function to resolve fetchedQueues and insights queue data
  const updateQueueList = () => {
    const tempQueues = [] as Array<TransferQueue>;
    fetchedQueues.forEach((value) => {
      const tempInsightsQueue = insightsQueues.find((item) => item.key === value.sid);
      const data = tempInsightsQueue?.data as IRealTimeQueueData;

      const transferQueue = {
        name: value.name,
        sid: value.sid,
        total_eligible_workers: data ? data.total_eligible_workers : null,
        total_available_workers: data ? data.total_available_workers : null,
        total_tasks: data ? data.total_tasks : null,
        longest_task_waiting_age: data ? data.longest_task_waiting_age : null,
        tasks_by_status: data ? data.tasks_by_status : null,
      } as TransferQueue;
      tempQueues.push(transferQueue);
    });

    // Apply filter and sort alphabetically
    const filteredQueues = tempQueues
      .filter((queue) => {
        if (showOnlyQueuesWithAvailableWorkers()) {
          // returning only queues with available workers
          // or queues where meta data is not available
          return (
            queue.name.includes(queueFilter) &&
            (queue.total_available_workers === null || queue.total_available_workers > 0)
          );
        }
        return queue.name.includes(queueFilter);
      })
      .sort((a: TransferQueue, b: TransferQueue) => (a.name > b.name ? 1 : -1));

    setQueues(filteredQueues);
  };

  const onTransferQueueClick = (queue: IQueue) => (transferOptions: TransferClickPayload) => {
    Actions.invokeAction('TransferTask', {
      task: props.task,
      targetSid: queue.sid,
      options: transferOptions,
    });
    Actions.invokeAction('HideDirectory');
  };

  // initial render
  useEffect(() => {
    // fetch the queues from the taskrouter sdk on initial render
    fetchSDKTaskQueues().catch(console.error);

    // fetch the queues from the insights client on initial render
    fetchInsightsQueueData().catch(console.error);
  }, []);

  // hook when fetchedQueues, insightsQueues or queueFilter are updated
  useEffect(() => {
    updateQueueList();
  }, [fetchedQueues, insightsQueues, queueFilter]);

  return (
    <Flex vertical wrap={false} grow={1} shrink={1}>
      <Stack element="TRANSFER_DIR_COMMON_TAB_CONTAINER" orientation="vertical" spacing="space0">
        <SearchBox onInputChange={onQueueSearchInputChange} />
        <Flex vertical grow={3} shrink={3} wrap={true}>
          <Stack element="TRANSFER_DIR_COMMON_ROWS_CONTAINER" orientation="vertical" spacing="space20">
            {Array.from(queues).map((queue: IQueue<any>) => {
              return (
                <QueueItem
                  task={props.task}
                  queue={queue}
                  key={queue.sid}
                  isWarmTransferEnabled={true}
                  onTransferClick={onTransferQueueClick(queue)}
                />
              );
            })}
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default withTaskContext(QueueDirectoryTab);
