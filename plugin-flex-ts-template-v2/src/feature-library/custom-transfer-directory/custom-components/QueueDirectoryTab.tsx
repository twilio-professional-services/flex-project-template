import { Alert } from '@twilio-paste/core/alert';
import { Flex } from '@twilio-paste/core/flex';
import {
  withTaskContext,
  Manager,
  IQueue,
  ClientManagerInstance,
  ClientManagerHelpers,
  Actions,
  ITask,
  Notifications,
  Template,
  templates,
} from '@twilio/flex-ui';
import { useEffect, useState, useRef } from 'react';
import debounce from 'lodash/debounce';
import { SyncMap } from 'twilio-sync';

import { getAllSyncMapItems } from '../../../utils/sdk-clients/sync/SyncClient';
import { SearchBox } from './CommonDirectoryComponents';
import { QueueItem } from './QueueItem';
import {
  showOnlyQueuesWithAvailableWorkers,
  shouldFetchInsightsData,
  enforceQueueFilterFromWorker,
  getGlobalFilter,
  shouldEnforceGlobalFilter,
} from '../config';
import { CustomTransferDirectoryNotification } from '../flex-hooks/notifications/CustomTransferDirectory';
import { CustomWorkerAttributes } from '../../../types/task-router/Worker';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';

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

const mapRealTimeDataToTransferQueueItem = (
  transferQueue: TransferQueue,
  queueData?: IRealTimeQueueData,
): TransferQueue => {
  transferQueue.total_eligible_workers = queueData ? queueData.total_eligible_workers : null;
  transferQueue.total_available_workers = queueData ? queueData.total_available_workers : null;
  transferQueue.total_tasks = queueData ? queueData.total_tasks : null;
  transferQueue.longest_task_waiting_age = queueData ? queueData.longest_task_waiting_age : null;
  transferQueue.tasks_by_status = queueData ? queueData.tasks_by_status : null;

  return transferQueue;
};

const QueueDirectoryTab = (props: OwnProps) => {
  const [fetchedQueues, setFetchedQueues] = useState([] as Array<IQueue>);
  const [insightsQueues, setInsightsQueues] = useState([] as Array<MapItem>);
  const [filteredQueues, setFilteredQueues] = useState([] as Array<TransferQueue>);

  const transferQueues = useRef([] as Array<TransferQueue>);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queueMap = useRef(null as SyncMap | null);

  const { workspaceClient, insightsClient, workerClient } = Manager.getInstance();

  // takes the input in the search box and applies it to the queue result
  // this will trigger the useEffect for a queueFilter update
  const onQueueSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-eq-null, eqeqeq
    if (event.target != null) {
      filterQueuesDebounce();
    }
  };

  // async function to retrieve the task queues from the tr sdk
  // this will trigger the useEffect for a fetchedQueues update
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
  // agent availability - it should be noted the insights client acts
  // like a cache and can go stale if account is not active
  // to restore the cache, tasks need to be pushed into the queue
  // this will trigger the useEffect for the insightsQueue update
  const fetchInsightsQueueData = async () => {
    // check if insights data has been turned off
    if (!shouldFetchInsightsData()) return;

    // check that the insights client is available
    if (
      !ClientManagerInstance.InsightsClient ||
      ClientManagerHelpers.isForcedDegraded(ClientManagerInstance.InsightsClient)
    ) {
      Notifications.showNotification(CustomTransferDirectoryNotification.FailedLoadingInsightsClient);
      return;
    }

    // get real time stats map
    queueMap.current = await insightsClient.map({
      id: 'realtime_statistics_v1',
      mode: 'open_existing',
    });

    if (!queueMap.current) {
      Notifications.showNotification(CustomTransferDirectoryNotification.FailedLoadingInsightsData);

      return;
    }

    // make sure all queues are loaded
    const insightQueues = await getAllSyncMapItems(queueMap.current);

    // update the queue item
    queueMap.current.on('itemUpdated', (updatedItem) => {
      const {
        item: { key, data },
      } = updatedItem;

      const queue = transferQueues.current.find((transferQueue) => transferQueue.sid === key);
      if (queue && data) {
        mapRealTimeDataToTransferQueueItem(queue, data as IRealTimeQueueData);
      }

      filterQueues();
    });

    // if a queue is added trigger a reload
    queueMap.current.on('itemAdded', () => {
      fetchSDKTaskQueues();
    });

    // if a queue is removed trigger a reload
    queueMap.current.on('itemRemoved', () => {
      fetchSDKTaskQueues();
    });

    setInsightsQueues(insightQueues);
  };

  // function to resolve fetchedQueues and insights queue data
  const generateTransferQueueList = () => {
    const tempQueues = [] as Array<TransferQueue>;
    fetchedQueues.forEach((value) => {
      const tempInsightsQueue = insightsQueues.find((item) => item.key === value.sid);
      const data = tempInsightsQueue?.data as IRealTimeQueueData;

      // merge the fetched queues data with the transfer queue data
      tempQueues.push(mapRealTimeDataToTransferQueueItem(value as TransferQueue, data));
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
        const searchString = searchInputRef.current?.value.toLocaleLowerCase() || '';
        return queue.name.toLocaleLowerCase().includes(searchString);
      })
      .filter((queue) => {
        if (showOnlyQueuesWithAvailableWorkers()) {
          // returning only queues with available workers
          // or queues where meta data is not available
          return queue.total_available_workers === null || queue.total_available_workers > 0;
        }
        return queue;
      })
      .filter((queue) => {
        const attributes = workerClient?.attributes as CustomWorkerAttributes;
        const enforcedQueueFilter = attributes?.enforcedQueueFilter?.toLocaleLowerCase();
        if (enforceQueueFilterFromWorker() && enforcedQueueFilter) {
          return queue.name.toLocaleLowerCase().includes(enforcedQueueFilter);
        }
        return queue;
      })
      .filter((queue) => {
        const enforcedQueueFilter = getGlobalFilter().toLocaleLowerCase();
        if (shouldEnforceGlobalFilter() && enforcedQueueFilter) {
          return !queue.name.toLocaleLowerCase().includes(enforcedQueueFilter);
        }
        return queue;
      })
      .sort((a: TransferQueue, b: TransferQueue) => (a.name > b.name ? 1 : -1));

    setFilteredQueues(updatedQueues);
  };

  const filterQueuesDebounce = debounce(filterQueues, 500, { maxWait: 1000 });

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

    return () => {
      if (queueMap.current) {
        queueMap.current.close();
      }
    };
  }, []);

  // hook when fetchedQueues, insightsQueues are updated
  useEffect(() => {
    generateTransferQueueList();
  }, [fetchedQueues, insightsQueues]);

  return (
    <Flex key="queue-tab-list" vertical wrap={false} grow={1} shrink={1}>
      <SearchBox key="key-tab-search-box" onInputChange={onQueueSearchInputChange} inputRef={searchInputRef} />
      <Flex key="queue-tab-results" vertical element="TRANSFER_DIR_COMMON_ROWS_CONTAINER">
        {filteredQueues.length === 0 ? (
          <Alert variant="neutral">
            <Template source={templates[StringTemplates.NoItemsFound]} />
            {showOnlyQueuesWithAvailableWorkers() ? ` ${templates[StringTemplates.QueuesFiltered]()}` : ''}
          </Alert>
        ) : (
          Array.from(filteredQueues).map((queue: TransferQueue) => {
            return (
              <QueueItem
                task={props.task}
                queue={queue}
                key={`queue-item-${queue.sid}`}
                onTransferClick={onTransferQueueClick(queue)}
              />
            );
          })
        )}
      </Flex>
    </Flex>
  );
};

export default withTaskContext(QueueDirectoryTab);
