import React, { useState } from 'react';
import { TaskHelper, ITask, styled, templates } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Button } from '@twilio-paste/core/button';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Text } from '@twilio-paste/core/text';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
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

const DirectoryItemContainer = styled('div')`
  padding-inline: 0.5rem;
  min-height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const DirectoryItem = (props: DirectoryItemProps) => {
  const { entry, task, onTransferClick } = props;
  const [isHovered, setIsHovered] = useState(false);

  const onWarmTransferClick = () => {
    onTransferClick({ mode: 'WARM' });
  };

  const onColdTransferClick = () => {
    onTransferClick({ mode: 'COLD' });
  };

  const renderIcon = (): React.JSX.Element => {
    if (entry.icon) {
      return entry.icon();
    }

    switch (entry.type) {
      case 'number':
        return <ProductPhoneNumbersIcon decorative={true} />;
      case 'queue':
        return <ProductContactCenterTeamsIcon decorative={true} />;
      default:
        return <AgentIcon decorative={true} />;
    }
  };

  const renderLabel = (): React.JSX.Element => (
    <Box key={`directory-item-label-${entry.type}-${entry.key}`} element="TRANSFER_DIR_COMMON_ROW_LABEL">
      {entry.labelComponent ? (
        entry.labelComponent()
      ) : (
        <Text as="div" className="Twilio" element="TRANSFER_DIR_COMMON_ROW_NAME">
          {entry.label}
        </Text>
      )}
    </Box>
  );

  return (
    <DirectoryItemContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={`directory-item-container-${entry.type}-${entry.key}`}
    >
      <Box key={`directory-item-icon-${entry.type}-${entry.key}`} element="TRANSFER_DIR_COMMON_ROW_ICON">
        {renderIcon()}
      </Box>
      {isHovered && entry.tooltip ? (
        <Tooltip
          key={`directory-item-label-tooltip-${entry.type}-${entry.key}`}
          element="TRANSFER_DIR_COMMON_TOOLTIP"
          text={entry.tooltip}
        >
          {renderLabel()}
        </Tooltip>
      ) : (
        renderLabel()
      )}

      {isHovered && (
        <ButtonGroup key={`directory-item-buttongroup-${entry.type}-${entry.key}`} attached>
          {entry.warm_transfer_enabled ? (
            <Tooltip
              key={`directory-item-buttons-warm-transfer-tooltip-${entry.type}-${entry.key}`}
              element="TRANSFER_DIR_COMMON_TOOLTIP"
              text={templates[StringTemplates.WarmTransfer]()}
            >
              <Button
                element="TRANSFER_DIR_COMMON_ROW_BUTTON"
                key={`directory-item-warm-transfer-button-${entry.type}-${entry.key}`}
                variant="secondary_icon"
                size="circle"
                onClick={onWarmTransferClick}
              >
                {task && TaskHelper.isChatBasedTask(task) ? (
                  <ChatIcon
                    key={`directory-item-warm-transfer-icon-${entry.type}-${entry.key}`}
                    decorative={false}
                    title=""
                  />
                ) : (
                  <CallTransferIcon
                    key={`directory-item-warm-transfer-icon-${entry.type}-${entry.key}`}
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
              key={`directory-item-buttons-cold-transfer-tooltip-${entry.type}-${entry.key}`}
              element="TRANSFER_DIR_COMMON_TOOLTIP"
              text={templates[StringTemplates.ColdTransfer]()}
            >
              <Button
                element="TRANSFER_DIR_COMMON_ROW_BUTTON"
                key={`directory-item-warm-transfer-button-${entry.type}-${entry.key}`}
                variant="secondary_icon"
                size="circle"
                onClick={onColdTransferClick}
              >
                {task && TaskHelper.isChatBasedTask(task) ? (
                  <SendIcon
                    key={`directory-item-cold-transfer-icon-${entry.type}-${entry.key}`}
                    decorative={false}
                    title=""
                  />
                ) : (
                  <CallOutgoingIcon
                    key={`directory-item-cold-transfer-icon-${entry.type}-${entry.key}`}
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
      )}
    </DirectoryItemContainer>
  );
};

export default DirectoryItem;
