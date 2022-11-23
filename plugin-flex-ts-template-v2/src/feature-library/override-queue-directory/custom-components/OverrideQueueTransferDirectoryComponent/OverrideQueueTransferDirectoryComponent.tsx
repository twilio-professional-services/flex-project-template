import React, { useState, useEffect } from 'react';
import * as TwilioFlex from '@twilio/flex-ui';
import { Actions, ITask, templates, withTaskContext } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Input } from '@twilio-paste/core/input';
import { Flex } from '@twilio-paste/core/flex';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import DirectoryItem from './DirectoryItem';

interface onTransferClick {
  (queue: any, options: any): void;
}

interface invokeTransfer {
  (payload: any): void;
}

export interface OverrideQueueTransferDirectoryProps {
  prop1: any;
  prop2: any;
  manager: TwilioFlex.Manager;
  onTransferClick: onTransferClick;
  invokeTransfer: invokeTransfer;
  task: ITask;
}

const OverrideQueueTransferDirectoryComponent = ({
  prop1,
  prop2,
  manager,
  onTransferClick,
  invokeTransfer,
  task,
}: OverrideQueueTransferDirectoryProps | any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [queuesList, setQueuesList] = useState([{ label: '' }]);

  onTransferClick = (queue: any, options: any) => {
    console.log('Execution reached here');
    console.log('queue is', queue);
    console.log('options are', options.mode);
    console.log('Task is ', task);
    if (options.mode === 'COLD') {
      Actions.invokeAction('TransferTask', {
        task: task,
        targetSid: queue.value,
        options: options,
      });
      Actions.invokeAction('HideDirectory');
    }
    // if (options.mode === 'WARM')
    // call transfertoQueue function
  };

  useEffect(() => {
    var elem = document.getElementById(
      'override_queue_transfer_directory_container'
    ) as HTMLElement;
    var parentNode = elem?.parentNode as HTMLElement;
    parentNode.style.display = 'block';
    getQueues();
  }, [searchQuery]);

  var getQueues = async () => {
    // Query for list of queues
    const queues = await (
      await manager.insightsClient.map({
        id: 'realtime_statistics_v1',
        mode: 'open_existing',
      })
    ).getItems();

    queues.items.map((queue: any) => {
      console.log('kkkkaa', queue);
    });

    // Apply filters
    var queueNameEnforcedFilter = '';
    const list = queues.items
      .map((queue: any) => {
        const {
          sid,
          friendly_name,
          total_available_workers: availableWorkers,
        } = queue.descriptor.data;
        console.log('uuuuuuuu2', sid, friendly_name, availableWorkers);

        return availableWorkers > -1 && // change to 0 instead of -1 later ------- //
          friendly_name
            .toLowerCase()
            .includes(queueNameEnforcedFilter.toLowerCase()) &&
          friendly_name.toLowerCase().includes(searchQuery.toLowerCase())
          ? { label: friendly_name, value: sid }
          : null;
      })
      // removes nulls
      .filter((elem: any) => elem)
      // sort alphabetically
      .sort((a: any, b: any) => (a.label > b.label ? 1 : -1));

    setQueuesList([] && list);

    console.log('uuuuu', queuesList);
  };

  return (
    <Flex>
      <Box
        paddingLeft="space20"
        paddingRight="space20"
        paddingTop="space30"
        paddingBottom="space20"
        width="100%"
      >
        <Box padding="space40" width="100%">
          <Input
            key="custom-directory-input-field"
            id="query_search"
            name="query_search"
            type="text"
            placeholder={templates.WorkerDirectorySearchPlaceholder()}
            insertBefore={
              <SearchIcon decorative={false} title="Description of icon" />
            }
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </Box>
        <Box
          // backgroundColor="colorBackgroundPrimaryWeak"
          // display="inline-block"
          padding="space40"
        >
          {queuesList.map((queue) => (
            <Box padding="space20">
              <DirectoryItem
                name={queue.label}
                item={queue}
                key={queue.label}
                onTransferClick={onTransferClick.bind(this)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Flex>
  );
};

export default OverrideQueueTransferDirectoryComponent;
