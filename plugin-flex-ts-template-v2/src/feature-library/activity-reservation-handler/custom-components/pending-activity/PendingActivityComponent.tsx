import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@twilio-paste/core';
import { Template, templates } from '@twilio/flex-ui';

import { getPendingActivity } from '../../helpers/pendingActivity';
import WorkerActivity from '../../helpers/workerActivityHelper';
import { StringTemplates } from '../../flex-hooks/strings/ActivityReservationHandler';

const PendingActivity = () => {
  const [clock, setClock] = useState(true);
  const [pendingActivity, setPendingActivity] = useState(getPendingActivity());

  useEffect(() => {
    const interval = setInterval(() => {
      setClock((currentClock) => !currentClock);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPendingActivity(getPendingActivity());
  }, [clock]);

  return (
    <>
      {pendingActivity && pendingActivity.name && WorkerActivity.activitySid !== pendingActivity.sid && (
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
