import React, { useState, useEffect } from 'react';
import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { TaskCardBox, TaskCardInnerBox } from './TaskCardWrapper.Styles';
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
      const [, setClock] = useState(true);
      // Add clock toggle to re-render every 10s
      useEffect(() => {
        const interval = setInterval(() => {
          setClock((currentClock) => !currentClock);
        }, 10000);
        return () => clearInterval(interval);
      }, []);

      const task = originalProps.task;
      const dateUpdated = task?.dateUpdated;
      let taskAge = 1;
      if (dateUpdated) {
        taskAge = (now.getTime() - dateUpdated?.getTime()) / 1000;
      }
      return (
        <TaskCardBox age={taskAge} redLine={getHTExceededThreshold()} yellowLine={getHTWarningThreshold()}>
          <TaskCardInnerBox>
            <Original {...originalProps} />
          </TaskCardInnerBox>
        </TaskCardBox>
      );
    });
  }
};
