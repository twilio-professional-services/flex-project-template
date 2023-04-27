import * as React from 'react';
import { IQueue, TaskHelper, ITask } from '@twilio/flex-ui';
import { ButtonGroup, Button, Stack, Tooltip, Text } from '@twilio-paste/core';
import { ProductContactCenterTeamsIcon } from '@twilio-paste/icons/esm/ProductContactCenterTeamsIcon';
import { CallTransferIcon } from '@twilio-paste/icons/esm/CallTransferIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';

import { TransferQueue } from './QueueDirectoryTab';

export interface QueueItemProps {
  queue: TransferQueue;
  task: ITask;
  onTransferClick: (options: any) => void;
  isWarmTransferEnabled?: boolean;
}

export const QueueItem = (props: QueueItemProps) => {
  const { queue, task, onTransferClick } = props;

  const onWarmTransferClick = () => {
    onTransferClick({ mode: 'WARM' });
  };

  const onColdTransferClick = () => {
    onTransferClick({ mode: 'COLD' });
  };

  const {
    total_eligible_workers: eligible,
    total_available_workers: available,
    total_tasks: tasks,
    longest_task_waiting_age: wait_time,
    tasks_by_status,
  } = queue;

  const status = `Agents: ${available}/${eligible} 
  Tasks in queue: ${tasks}
  Wait Time: ${wait_time}
  Tasks by status:
    Assigned: ${tasks_by_status?.assigned}
    Pending: ${tasks_by_status?.pending}
    Reserved: ${tasks_by_status?.reserved}
    Wrapping: ${tasks_by_status?.wrapping}`;

  return (
    <Stack
      element="TRANSFER_DIR_QUEUE_HORIZONTAL_ROW_CONTAINER"
      orientation="horizontal"
      spacing="space40"
      key={`queue-item-container-${queue.sid}`}
    >
      <ProductContactCenterTeamsIcon element="TRANSFER_DIR_COMMON_ROW_ICON" decorative={false} title={queue.name} />

      <Tooltip element="TRANSFER_DIR_COMMON_TOOLTIP" text={status}>
        <Text element="TRANSFER_DIR_COMMON_ROW_NAME" as="div" title={queue.name} className="Twilio">
          {queue.name}
        </Text>
      </Tooltip>

      <ButtonGroup element="TRANSFER_DIR_COMMON_ROW_BUTTONGROUP" attached>
        <Tooltip element="TRANSFER_DIR_COMMON_TOOLTIP" text="Warm Transfer">
          <Button variant="secondary_icon" size="circle" onClick={onWarmTransferClick}>
            {TaskHelper.isChatBasedTask(task) ? (
              <ChatIcon decorative={false} title="Warm Transfer" />
            ) : (
              <CallTransferIcon decorative={false} title="Warm Transfer" />
            )}
          </Button>
        </Tooltip>
        <Tooltip element="TRANSFER_DIR_COMMON_TOOLTIP" text="Cold Transfer">
          <Button variant="secondary_icon" size="circle" onClick={onColdTransferClick}>
            {TaskHelper.isChatBasedTask(task) ? (
              <SendIcon decorative={false} title="Warm Transfer" />
            ) : (
              <CallOutgoingIcon decorative={false} title="Warm Transfer" />
            )}
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Stack>
  );
};
