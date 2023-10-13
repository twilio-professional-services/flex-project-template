import React from 'react';
import { Flex } from '@twilio-paste/core/flex';
import { Text } from '@twilio-paste/core/text';
import { Template, templates, useFlexSelector } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';

import { StringTemplates } from '../../flex-hooks/strings/ActivityReservationHandler';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { ActivityReservationHandlerState } from '../../flex-hooks/reducers/ActivityReservationHandler';

const PendingActivity = () => {
  const { pendingActivity } = useSelector(
    (state: AppState) => state[reduxNamespace].activityReservationHandler as ActivityReservationHandlerState,
  );
  const { activity: currentActivity } = useFlexSelector((state: AppState) => state.flex.worker);

  return (
    <>
      {pendingActivity && pendingActivity.name !== currentActivity.name && (
        <Flex vertical marginRight="space20" hAlignContent="center">
          <Text as="p" color="colorTextInverse" fontSize="fontSize20" fontWeight="fontWeightBold">
            <Template source={templates[StringTemplates.PendingActivity]} />
          </Text>
          <Text as="p" color="colorTextInverse" fontSize="fontSize10" lineHeight="lineHeight10">
            {pendingActivity.name}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default PendingActivity;
