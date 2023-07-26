import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { TaskCardBox } from './TaskCardWrapper.Styles';
import {
  isHTHighlightEnabled,
  getHTWarningThreshold,
  getHTExceededThreshold,
  isDisplayTaskQueueNameEnabled,
} from '../../config';

export const componentName = FlexComponent.TeamsView;
export const componentHook = function addTaskCardWrapper(flex: typeof Flex, manager: Flex.Manager) {
  if (isDisplayTaskQueueNameEnabled()) {
    // instead of {{task.defaultFrom}}, show the queue name on the Task Card
    manager.strings.SupervisorTaskCardHeader = '{{task.queueName}}';
  }
  if (isHTHighlightEnabled()) {
    flex.Supervisor.TaskCard.Content.addWrapper((Original) => (originalProps) => {
      const now = new Date();
      const task = originalProps.task;
      const dateUpdated = task?.dateUpdated;
      let taskAge = 1;
      if (dateUpdated) {
        taskAge = (now.getTime() - dateUpdated?.getTime()) / 1000;
      }
      return (
        <TaskCardBox age={taskAge} redLine={getHTExceededThreshold()} yellowLine={getHTWarningThreshold()}>
          <Original {...originalProps} />
        </TaskCardBox>
      );
    });
  }
};
