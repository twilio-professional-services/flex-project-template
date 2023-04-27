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
import { useEffect, useState, useRef } from 'react';

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
  const [filteredQueues, setFilteredQueues] = useState([] as Array<TransferQueue>);
  const [queueFilterTimer, setQueueFiltertimer] = useState(null as number | null);

  const transferQueues = useRef([] as Array<TransferQueue>);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { workspaceClient, insightsClient } = Manager.getInstance();

  // takes the input in the search box and applies it to the queue result
  // this will trigger the useEffect for a queueFilter update
  const onQueueSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fetchedQueues || queueFilterTimer) {
      return;
    }

    setQueueFiltertimer(
      window.setTimeout(() => {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (event.target != null) {
          filterQueues();
          setQueueFiltertimer(null);
        }
      }, 300),
    );
  };

  // async function to retrieve the task queues from the tr sdk
  // this will trrigger the useEffect for a fetchedQueues update
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
  // this will trigger the useEffect for the insightsQueue update
  const fetchInsightsQueueData = async () => {
    // check the insights client is available
    if (
      !ClientManagerInstance.InsightsClient ||
      ClientManagerHelpers.isForcedDegraded(ClientManagerInstance.InsightsClient)
    ) {
      return;
    }

    // get real time stats map
    const queueMap = await insightsClient.map({
      id: 'realtime_statistics_v1',
      mode: 'open_existing',
    });

    // make sure all queues are loaded
    const insightQueues = await getAllSyncMapItems(queueMap);

    // update the queue item
    queueMap.on('itemUpdated', (updatedItem) => {
      const {
        item: { key, data },
      } = updatedItem;

      const queue = transferQueues.current.find((transferQueue) => transferQueue.sid === key);
      if (queue) {
        queue.total_eligible_workers = data ? data.total_eligible_workers : null;
        queue.total_available_workers = data ? data.total_available_workers : null;
        queue.total_tasks = data ? data.total_tasks : null;
        queue.longest_task_waiting_age = data ? data.longest_task_waiting_age : null;
        queue.tasks_by_status = data ? data.tasks_by_status : null;
      }

      filterQueues();
    });

    // if a queue is added trrigger a reload
    queueMap.on('itemAdded', () => {
      fetchSDKTaskQueues();
    });

    // if a queue is removed trigger a reload
    queueMap.on('itemRemoved', () => {
      fetchSDKTaskQueues();
    });

    setInsightsQueues(insightQueues);
  };

  // function to resolve fetchedQueues and insights queue data
  const generateQueueList = () => {
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

    // cache the merged list of fetched queues with real time data
    transferQueues.current = tempQueues;

    // Apply filter and sort alphabetically
    filterQueues();
  };

  // function to filter the generatedQueueList and trigger a rerender
  const filterQueues = () => {
    const updatedQueues = transferQueues.current
      .filter((queue) => {
        const searchString = searchInputRef.current?.value || '';
        if (showOnlyQueuesWithAvailableWorkers()) {
          // returning only queues with available workers
          // or queues where meta data is not available
          return (
            queue.name.includes(searchString) &&
            (queue.total_available_workers === null || queue.total_available_workers > 0)
          );
        }
        return queue.name.includes(searchString);
      })
      .sort((a: TransferQueue, b: TransferQueue) => (a.name > b.name ? 1 : -1));

    setFilteredQueues(updatedQueues);
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

  // hook when fetchedQueues, insightsQueues are updated
  useEffect(() => {
    generateQueueList();
  }, [fetchedQueues, insightsQueues]);

  return (
    <Flex key="queue-tab-list" vertical wrap={false} grow={1} shrink={1}>
      <SearchBox key="key-tab-search-box" onInputChange={onQueueSearchInputChange} inputRef={searchInputRef} />
      <Flex
        key="queue-tab-results"
        vertical
        grow={1}
        shrink={1}
        wrap={true}
        element="TRANSFER_DIR_COMMON_ROWS_CONTAINER"
      >
        <Stack key="queue-tab-results-list" orientation="vertical" spacing="space20">
          {Array.from(filteredQueues).map((queue: IQueue<any>) => {
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
    </Flex>
  );
};

export default withTaskContext(QueueDirectoryTab);
