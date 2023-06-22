import React from 'react';
import { useFlexSelector } from '@twilio/flex-ui';

import IFrameWrapper from './IFrameWrapper';
import AppState from '../../../../types/manager/AppState';

export const IFrameCRMComponent = () => {
  const tasks = useFlexSelector((state: AppState) => state.flex.worker.tasks);

  // Only render iframes for tasks without a parent task
  const tasksFiltered = Array.from(tasks.values()).filter((task) => !task.attributes.parentTask);

  return (
    <div>
      {tasksFiltered.map((task) => (
        <IFrameWrapper thisTask={task} key={task.taskSid} />
      ))}
    </div>
  );
};
