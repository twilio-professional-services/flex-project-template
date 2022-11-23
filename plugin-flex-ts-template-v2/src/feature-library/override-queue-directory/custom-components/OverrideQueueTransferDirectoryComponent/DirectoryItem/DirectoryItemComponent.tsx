import * as React from 'react';
import { IconButton, templates, ITask } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/text';
import { isMultiParticipantEnabled } from '../../../index';

// interface DirectoryItemProps {
//   task: ITask;
// }

// interface DirectoryCustomizationProps {
//   name: string;
// }

interface onTransferClick {
  (item: any, options: any): void;
}

export interface OwnProps {
  task: ITask;
  item: any;
  onTransferClick: onTransferClick;
  name: string;
}

const DirectoryItem = ({ name, item, onTransferClick }: OwnProps | any) => {
  const onWarmTransferClick = (event: any) => {
    console.log('Hello');
    onTransferClick(item, { mode: 'WARM' });
  };

  const onColdTransferClick = (event: any) => {
    console.log('Cold Transfer');
    onTransferClick(item, { mode: 'COLD' });
  };

  return (
    <Flex>
      <Flex>
        <Box
          // backgroundColor="colorBackgroundPrimaryWeak"
          padding="space20"
        >
          <IconButton
            icon="Queue"
            key="Queue-open"
            size="small"
            // disabled={disableTransferButtonForTask}
            // onClick={onShowDirectory}
            variant="secondary"
            title="Transfer Chat"
            css=""
          />
        </Box>
      </Flex>
      <Flex grow>
        <Box
          // backgroundColor="colorBackgroundPrimaryWeaker"
          paddingLeft="space20"
          paddingRight="space20"
          paddingTop="space10"
          paddingBottom="space40"
          width="100%"
        >
          <Text
            as="p"
            fontSize="fontSize30"
            fontWeight="fontWeightBold"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {name}
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Box
          // backgroundColor="colorBackgroundPrimaryWeak"
          padding="space20"
        >
          {isMultiParticipantEnabled() && (
            <IconButton
              icon="GroupCall"
              variant="secondary"
              className="WarmTransfer"
              onClick={onWarmTransferClick}
              size="small"
              title={templates.WarmTransferTooltip()}
              css=""
            />
          )}
        </Box>
        <Box
          // backgroundColor="colorBackgroundPrimaryStrong"
          padding="space20"
        >
          <IconButton
            icon="Transfer"
            className="ColdTransfer"
            onClick={onColdTransferClick}
            variant="secondary"
            size="small"
            title={templates.ColdTransferTooltip()}
            css=""
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DirectoryItem;
