import * as React from 'react';
import { TaskHelper, ITask, Manager, templates } from '@twilio/flex-ui';
import { ButtonGroup, Button, Flex, Tooltip, Text } from '@twilio-paste/core';
import { ProductContactCenterTeamsIcon } from '@twilio-paste/icons/esm/ProductContactCenterTeamsIcon';
import { CallTransferIcon } from '@twilio-paste/icons/esm/CallTransferIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';

import { TransferQueue } from './QueueDirectoryTab';
import { isCbmColdTransferEnabled, isCbmWarmTransferEnabled, showRealTimeQueueData } from '../config';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';

export interface QueueItemProps {
  queue: TransferQueue;
  task: ITask;
  onTransferClick: (options: any) => void;
}

export const QueueItem = (props: QueueItemProps) => {
  const { queue, task, onTransferClick } = props;

  const onWarmTransferClick = () => {
    onTransferClick({ mode: 'WARM' });
  };

  const onColdTransferClick = () => {
    onTransferClick({ mode: 'COLD' });
  };

  const na = templates[StringTemplates.NA]();

  const { total_eligible_workers: eligible, total_available_workers: available, total_tasks: tasks } = queue;

  const agentsAvailable = !available || !eligible ? na : `${available}/${eligible}`;
  // eslint-disable-next-line no-eq-null, eqeqeq
  const tasksInQueue = tasks != null && tasks >= 0 ? `${tasks}` : na;

  const queue_tooltip = showRealTimeQueueData()
    ? templates[StringTemplates.QueueTooltip]({ agentsAvailable, tasksInQueue })
    : `${queue.name}`;

  const callWarmTransferEnabled =
    Manager.getInstance().store.getState().flex.featureFlags.features['flex-warm-transfers']?.enabled;

  const isWarmTransferEnabled =
    task && TaskHelper.isCBMTask(task) ? isCbmWarmTransferEnabled() : callWarmTransferEnabled;
  const isColdTransferEnabled = task && TaskHelper.isCBMTask(task) ? isCbmColdTransferEnabled() : true;

  return (
    <Flex
      element="TRANSFER_DIR_COMMON_HORIZONTAL_ROW_CONTAINER"
      vertical={false}
      vAlignContent="center"
      key={`queue-item-container-${queue.sid}`}
    >
      <ProductContactCenterTeamsIcon
        key={`queue-item-${queue.sid}`}
        element="TRANSFER_DIR_COMMON_ROW_ICON"
        decorative={false}
        title={queue.name}
      />

      <Tooltip key={`queue-item-label-tooltip-${queue.sid}`} element="TRANSFER_DIR_COMMON_TOOLTIP" text={queue_tooltip}>
        <Text
          key={`queue-item-label-${queue.sid}`}
          element="TRANSFER_DIR_COMMON_ROW_NAME"
          as="div"
          title={queue.name}
          className="Twilio"
        >
          {queue.name}
        </Text>
      </Tooltip>

      <ButtonGroup element="TRANSFER_DIR_COMMON_ROW_BUTTONGROUP" key={`queue-item-buttongroup-${queue.sid}`} attached>
        {isWarmTransferEnabled ? (
          <Tooltip
            key={`queue-item-buttons-warm-transfer-tooltip-${queue.sid}`}
            element="TRANSFER_DIR_COMMON_TOOLTIP"
            text={templates[StringTemplates.WarmTransfer]()}
          >
            <Button
              element="TRANSFER_DIR_COMMON_ROW_BUTTON"
              key={`queue-item-warm-transfer-button-${queue.sid}`}
              variant="secondary_icon"
              size="circle"
              onClick={onWarmTransferClick}
            >
              {task && TaskHelper.isChatBasedTask(task) ? (
                <ChatIcon key={`queue-item-warm-transfer-icon-${queue.sid}`} decorative={false} title="" />
              ) : (
                <CallTransferIcon key={`queue-item-warm-transfer-icon-${queue.sid}`} decorative={false} title="" />
              )}
            </Button>
          </Tooltip>
        ) : (
          <div></div>
        )}
        {isColdTransferEnabled ? (
          <Tooltip
            key={`queue-item-buttons-cold-transfer-tooltip-${queue.sid}`}
            element="TRANSFER_DIR_COMMON_TOOLTIP"
            text={templates[StringTemplates.ColdTransfer]()}
          >
            <Button
              element="TRANSFER_DIR_COMMON_ROW_BUTTON"
              key={`queue-item-warm-transfer-button-${queue.sid}`}
              variant="secondary_icon"
              size="circle"
              onClick={onColdTransferClick}
            >
              {task && TaskHelper.isChatBasedTask(task) ? (
                <SendIcon key={`queue-item-cold-transfer-icon-${queue.sid}`} decorative={false} title="" />
              ) : (
                <CallOutgoingIcon key={`queue-item-cold-transfer-icon-${queue.sid}`} decorative={false} title="" />
              )}
            </Button>
          </Tooltip>
        ) : (
          <div></div>
        )}
      </ButtonGroup>
    </Flex>
  );
};
