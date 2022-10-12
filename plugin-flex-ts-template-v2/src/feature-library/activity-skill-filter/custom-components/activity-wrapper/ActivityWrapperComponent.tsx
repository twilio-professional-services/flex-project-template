import * as Flex from '@twilio/flex-ui';
import React, { useEffect } from 'react';
import { ActivityWrapper } from './ActivityWrapperStyles';
import AgentActivities from '../../utils/AgentActivities';
import { AppState } from 'flex-hooks/states';

function ActivityWrapperComponent() {
  const workerAttrs = Flex.useFlexSelector((state: AppState) => state.flex.worker.attributes);
  
  useEffect(() => {
    console.log("Worker attributes changed; updating filtered activities")
  }, [workerAttrs]);
  
  // NOTE: This will use a "hack" of sorts...
  // Using css it will show/hide and change the order of the activities
  // Mostly because there isn't a way to hook into the native component
  return (
    <ActivityWrapper activitiesConfig={AgentActivities.getCSSConfig()}>
      <Flex.Activity />
    </ActivityWrapper>
  );
}

export default ActivityWrapperComponent;