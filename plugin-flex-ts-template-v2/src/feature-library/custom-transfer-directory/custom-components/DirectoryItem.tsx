import * as React from 'react';
import { TaskHelper, ITask, templates } from '@twilio/flex-ui';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Text } from '@twilio-paste/core/text';
import { ProductContactCenterTeamsIcon } from '@twilio-paste/icons/esm/ProductContactCenterTeamsIcon';
import { ProductPhoneNumbersIcon } from '@twilio-paste/icons/esm/ProductPhoneNumbersIcon';
import { CallTransferIcon } from '@twilio-paste/icons/esm/CallTransferIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';

import { DirectoryEntry } from '../types/DirectoryEntry';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';

export interface DirectoryItemProps {
  entry: DirectoryEntry;
  task: ITask;
  onTransferClick: (options: any) => void;
}

export const DirectoryItem = (props: DirectoryItemProps) => {
  const { entry, task, onTransferClick } = props;

  const onWarmTransferClick = () => {
    onTransferClick({ mode: 'WARM' });
  };

  const onColdTransferClick = () => {
    onTransferClick({ mode: 'COLD' });
  };

  return (
    <Flex
      element="TRANSFER_DIR_COMMON_HORIZONTAL_ROW_CONTAINER"
      vertical={false}
      vAlignContent="center"
      key={`directory-item-container-${entry.type}-${entry.address}`}
    >
      {entry.type === 'number' && (
        <ProductPhoneNumbersIcon
          key={`directory-item-${entry.type}-${entry.address}`}
          element="TRANSFER_DIR_COMMON_ROW_ICON"
          decorative={true}
        />
      )}
      {entry.type === 'queue' && (
        <ProductContactCenterTeamsIcon
          key={`directory-item-${entry.type}-${entry.address}`}
          element="TRANSFER_DIR_COMMON_ROW_ICON"
          decorative={true}
        />
      )}

      <Tooltip
        key={`directory-item-label-tooltip-${entry.type}-${entry.address}`}
        element="TRANSFER_DIR_COMMON_TOOLTIP"
        text={entry.tooltip ?? entry.label}
      >
        <Text
          key={`directory-item-label-${entry.type}-${entry.address}`}
          element="TRANSFER_DIR_COMMON_ROW_NAME"
          as="div"
          className="Twilio"
        >
          {entry.label}
        </Text>
      </Tooltip>

      <ButtonGroup
        element="TRANSFER_DIR_COMMON_ROW_BUTTONGROUP"
        key={`directory-item-buttongroup-${entry.type}-${entry.address}`}
        attached
      >
        {entry.warm_transfer_enabled ? (
          <Tooltip
            key={`directory-item-buttons-warm-transfer-tooltip-${entry.type}-${entry.address}`}
            element="TRANSFER_DIR_COMMON_TOOLTIP"
            text={templates[StringTemplates.WarmTransfer]()}
          >
            <Button
              element="TRANSFER_DIR_COMMON_ROW_BUTTON"
              key={`directory-item-warm-transfer-button-${entry.type}-${entry.address}`}
              variant="secondary_icon"
              size="circle"
              onClick={onWarmTransferClick}
            >
              {task && TaskHelper.isChatBasedTask(task) ? (
                <ChatIcon
                  key={`directory-item-warm-transfer-icon-${entry.type}-${entry.address}`}
                  decorative={false}
                  title=""
                />
              ) : (
                <CallTransferIcon
                  key={`directory-item-warm-transfer-icon-${entry.type}-${entry.address}`}
                  decorative={false}
                  title=""
                />
              )}
            </Button>
          </Tooltip>
        ) : (
          <div></div>
        )}
        {entry.cold_transfer_enabled ? (
          <Tooltip
            key={`directory-item-buttons-cold-transfer-tooltip-${entry.type}-${entry.address}`}
            element="TRANSFER_DIR_COMMON_TOOLTIP"
            text={templates[StringTemplates.ColdTransfer]()}
          >
            <Button
              element="TRANSFER_DIR_COMMON_ROW_BUTTON"
              key={`directory-item-warm-transfer-button-${entry.type}-${entry.address}`}
              variant="secondary_icon"
              size="circle"
              onClick={onColdTransferClick}
            >
              {task && TaskHelper.isChatBasedTask(task) ? (
                <SendIcon
                  key={`directory-item-cold-transfer-icon-${entry.type}-${entry.address}`}
                  decorative={false}
                  title=""
                />
              ) : (
                <CallOutgoingIcon
                  key={`directory-item-cold-transfer-icon-${entry.type}-${entry.address}`}
                  decorative={false}
                  title=""
                />
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
