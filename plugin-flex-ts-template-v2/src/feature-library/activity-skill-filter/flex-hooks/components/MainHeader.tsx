import * as Flex from '@twilio/flex-ui';
import React, { useEffect } from 'react';
import AppState from 'types/manager/AppState';

import { NotificationIds } from '../notifications/ActivitySkillFilter';
import { getRules } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';
import ActivityWrapper from '../../custom-components/activity-wrapper';
import AgentActivities from '../../utils/AgentActivities';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function wrapActivityComponent(flex: typeof Flex, _manager: Flex.Manager) {
  if (!getRules()) {
    Flex.Notifications.showNotification(NotificationIds.ActivitySkillRulesNotConfigured);
    return;
  }

  flex.MainHeader.Content.addWrapper((OriginalComponent) => (originalProps) => {
    const workerAttrs = Flex.useFlexSelector((state: AppState) => state.flex.worker.attributes);

    useEffect(() => {
      console.log('Worker attributes changed; updating filtered activities');
    }, [workerAttrs]);

    // NOTE: This will use a "hack" of sorts...
    // Using css it will show/hide and change the order of the activities
    // Mostly because there isn't a way to hook into the native component
    return (
      <ActivityWrapper activitiesConfig={AgentActivities.getCSSConfig()}>
        <OriginalComponent {...originalProps} />
      </ActivityWrapper>
    );
  });
};
