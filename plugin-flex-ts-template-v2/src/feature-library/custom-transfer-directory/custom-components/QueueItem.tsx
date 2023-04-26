import * as React from 'react';
import { IQueue, TaskHelper, withTaskContext, ITask } from '@twilio/flex-ui';
import { ButtonGroup, Button, Stack, Tooltip, Text } from '@twilio-paste/core';
import { ProductContactCenterTeamsIcon } from '@twilio-paste/icons/esm/ProductContactCenterTeamsIcon';
import { CallTransferIcon } from '@twilio-paste/icons/esm/CallTransferIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';

export interface QueueItemProps {
  queue: IQueue;
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

  return (
    <Stack
      element="TRANSFER_DIR_QUEUE_HORIZONTAL_ROW_CONTAINER"
      orientation="horizontal"
      spacing="space40"
      key={`queue-item-container-${queue.sid}`}
    >
      <ProductContactCenterTeamsIcon
        element="TRANSFER_DIR_COMMON_ROW_ICON"
        decorative={false}
        title={`Transfer to Queue: ${queue.name}`}
      />

      <Text element="TRANSFER_DIR_COMMON_ROW_NAME" as="div" className="Twilio">
        {queue.name}
      </Text>

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
