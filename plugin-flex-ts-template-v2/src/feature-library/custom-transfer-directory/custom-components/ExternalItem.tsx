import * as React from 'react';
import { ITask, templates } from '@twilio/flex-ui';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Text } from '@twilio-paste/core/text';
import { ProductPhoneNumbersIcon } from '@twilio-paste/icons/esm/ProductPhoneNumbersIcon';
import { CallTransferIcon } from '@twilio-paste/icons/esm/CallTransferIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

import { ExternalDirectoryEntry } from '../types/ServiceConfiguration';
import { isVoiceXWTEnabled } from '../config';
import { StringTemplates } from '../flex-hooks/strings/CustomTransferDirectory';

export interface ExternalItemProps {
  entry: ExternalDirectoryEntry;
  index: number;
  task: ITask;
  onTransferClick: (options: any) => void;
}

export const ExternalItem = (props: ExternalItemProps) => {
  const { entry, index, onTransferClick } = props;

  const onWarmTransferClick = () => {
    onTransferClick({ mode: 'WARM' });
  };

  const onColdTransferClick = () => {
    onTransferClick({ mode: 'COLD' });
  };

  const isWarmTransferEnabled = entry.warm_transfer_enabled && isVoiceXWTEnabled();
  const isColdTransferEnabled = entry.cold_transfer_enabled;

  return (
    <Flex
      element="TRANSFER_DIR_COMMON_HORIZONTAL_ROW_CONTAINER"
      vertical={false}
      vAlignContent="center"
      key={`ext-dir-item-container-${index}`}
    >
      <ProductPhoneNumbersIcon
        key={`ext-dir-item-${index}`}
        element="TRANSFER_DIR_COMMON_ROW_ICON"
        decorative={false}
        title={entry.label}
      />

      <Tooltip key={`ext-dir-item-label-tooltip-${index}`} element="TRANSFER_DIR_COMMON_TOOLTIP" text={entry.label}>
        <Text
          key={`ext-dir-item-label-${index.toString()}`}
          element="TRANSFER_DIR_COMMON_ROW_NAME"
          as="div"
          title={entry.label}
          className="Twilio"
        >
          {entry.label}
        </Text>
      </Tooltip>

      <ButtonGroup element="TRANSFER_DIR_COMMON_ROW_BUTTONGROUP" key={`ext-dir-item-buttongroup-${index}`} attached>
        {isWarmTransferEnabled ? (
          <Tooltip
            key={`ext-dir-item-buttons-warm-transfer-tooltip-${index}`}
            element="TRANSFER_DIR_COMMON_TOOLTIP"
            text={templates[StringTemplates.WarmTransfer]()}
          >
            <Button
              element="TRANSFER_DIR_COMMON_ROW_BUTTON"
              key={`ext-dir-item-warm-transfer-button-${index}`}
              variant="secondary_icon"
              size="circle"
              onClick={onWarmTransferClick}
            >
              <CallTransferIcon key={`ext-dir-item-warm-transfer-icon-${index}`} decorative={false} title="" />
            </Button>
          </Tooltip>
        ) : (
          <div></div>
        )}
        {isColdTransferEnabled ? (
          <Tooltip
            key={`ext-dir-item-buttons-cold-transfer-tooltip-${index}`}
            element="TRANSFER_DIR_COMMON_TOOLTIP"
            text={templates[StringTemplates.ColdTransfer]()}
          >
            <Button
              element="TRANSFER_DIR_COMMON_ROW_BUTTON"
              key={`ext-dir-item-warm-transfer-button-${index}`}
              variant="secondary_icon"
              size="circle"
              onClick={onColdTransferClick}
            >
              <CallOutgoingIcon key={`ext-dir-item-cold-transfer-icon-${index}`} decorative={false} title="" />
            </Button>
          </Tooltip>
        ) : (
          <div></div>
        )}
      </ButtonGroup>
    </Flex>
  );
};
