import React from 'react';
import { useFlexSelector } from '@twilio/flex-ui';

import AppState from '../../../../types/manager/AppState';
import TabbedCRMTask from '../TabbedCRMTask';

export const TabbedCRMContainer = () => {
  const tasks = useFlexSelector((state: AppState) => state.flex.worker.tasks);

  // Only render new containers for tasks without a parent task
  const tasksFiltered = Array.from(tasks.values()).filter((task) => !task.attributes.parentTask);

  // Render for only the filtered tasks as well as an instance for when there is no task selected
  return (
    <>
      {tasksFiltered.map((task) => (
        <TabbedCRMTask thisTask={task} key={task.taskSid} />
      ))}
      <TabbedCRMTask thisTask={undefined} key="no-task" />
    </>
  );
};
