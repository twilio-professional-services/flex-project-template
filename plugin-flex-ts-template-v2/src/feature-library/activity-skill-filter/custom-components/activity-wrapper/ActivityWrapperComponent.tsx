// @ts-nocheck
// The Flex.Activity component has an incompatible interface between Flex UI 2.1.x and Flex UI 2.2.0.
// Disable type checking in this file to enable usage across different Flex UI versions.
import * as Flex from '@twilio/flex-ui';
import React, { useEffect } from 'react';
import AppState from 'types/manager/AppState';

import { ActivityWrapper } from './ActivityWrapperStyles';
import AgentActivities from '../../utils/AgentActivities';

function ActivityWrapperComponent() {
  const workerAttrs = Flex.useFlexSelector((state: AppState) => state.flex.worker.attributes);

  useEffect(() => {
    console.log('Worker attributes changed; updating filtered activities');
  }, [workerAttrs]);

  // NOTE: This will use a "hack" of sorts...
  // Using css it will show/hide and change the order of the activities
  // Mostly because there isn't a way to hook into the native component
  return (
    <ActivityWrapper activitiesConfig={AgentActivities.getCSSConfig()}>
      <Flex.Activity disabled={false} />
    </ActivityWrapper>
  );
}

export default ActivityWrapperComponent;
