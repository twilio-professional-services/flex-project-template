import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@twilio-paste/core';
import { Manager, Template, templates } from '@twilio/flex-ui';

import ActivityManager from '../../helper/ActivityManager';
import { StringTemplates } from '../../flex-hooks/strings/ActivityReservationHandler';

const PendingActivity = () => {
  const [clock, setClock] = useState(true);
  const [pendingActivity, setPendingActivity] = useState(ActivityManager.getPendingActivity());

  useEffect(() => {
    const interval = setInterval(() => {
      setClock((currentClock) => !currentClock);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPendingActivity(ActivityManager.getPendingActivity());
  }, [clock]);

  return (
    <>
      {pendingActivity && pendingActivity.name !== Manager.getInstance().workerClient?.activity.name && (
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
