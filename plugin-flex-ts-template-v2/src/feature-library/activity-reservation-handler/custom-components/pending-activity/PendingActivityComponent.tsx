import React from 'react';
import { getPendingActivity } from '../../helpers/pendingActivity'
import { Ticker } from "@twilio/flex-ui-core"
import { Flex, Text } from "@twilio-paste/core"
 
const PendingActivity = () => {
  return <Ticker>
    {() => {
      const pendingActivity = getPendingActivity();

      return (
        pendingActivity && pendingActivity.name ?
          (
            <Flex vertical marginRight="space20" hAlignContent="center">
              <Text as="p" color="colorTextInverse" marginY="space10" fontSize="fontSize20" fontWeight="fontWeightBold">Pending Activity</Text>
              <Text as="p" color="colorTextInverse" fontSize="fontSize10">{pendingActivity.name}</Text>
            </Flex>
          )
          : null
        )
      }
    }
    </Ticker>
}

export default PendingActivity;
