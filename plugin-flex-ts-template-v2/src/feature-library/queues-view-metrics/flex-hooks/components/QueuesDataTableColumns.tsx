import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';

import { FlexComponent } from '../../../../types/feature-loader';
import { isAssignedTasksColumnEnabled, isWrappingTasksColumnEnabled } from '../../config';
import { StringTemplates } from '../strings';
import { isColumnDescriptionSupported } from '../../utils/helpers';

export const componentName = FlexComponent.QueueStats;
export const componentHook = function addQueuesDataTableColumns(flex: typeof Flex, manager: Flex.Manager) {
  if (isAssignedTasksColumnEnabled()) {
    if (isColumnDescriptionSupported()) {
      flex.QueuesStats.QueuesDataTable.Content.add(
        <flex.ColumnDefinition
          key="assigned-tasks"
          header={manager.strings.TaskAssigned}
          subHeader={manager.strings.QueuesStatsSubHeaderNow}
          description={(manager.strings as any)[StringTemplates.AssignedTasksMetric]}
          content={(queue: WorkerQueue) => {
            const assignedTasks = queue.tasks_by_status?.assigned || 0;
            return <span>{assignedTasks}</span>;
          }}
        />,
        { sortOrder: 0 },
      );
    } else {
      flex.QueuesStats.QueuesDataTable.Content.add(
        <flex.ColumnDefinition
          key="assigned-tasks"
          header={manager.strings.TaskAssigned}
          subHeader={manager.strings.QueuesStatsSubHeaderNow}
          content={(queue: WorkerQueue) => {
            const assignedTasks = queue.tasks_by_status?.assigned || 0;
            return <span>{assignedTasks}</span>;
          }}
        />,
        { sortOrder: 0 },
      );
    }
  }
  if (isWrappingTasksColumnEnabled()) {
    if (isColumnDescriptionSupported()) {
      flex.QueuesStats.QueuesDataTable.Content.add(
        <flex.ColumnDefinition
          key="wrapping-tasks"
          header={manager.strings.TaskWrapup}
          subHeader={manager.strings.QueuesStatsSubHeaderNow}
          description={(manager.strings as any)[StringTemplates.WrappingTasksMetric]}
          content={(queue: WorkerQueue) => {
            const wrappingTasks = queue.tasks_by_status?.wrapping || 0;
            return <span>{wrappingTasks}</span>;
          }}
        />,
        { sortOrder: 0 },
      );
    } else {
      flex.QueuesStats.QueuesDataTable.Content.add(
        <flex.ColumnDefinition
          key="wrapping-tasks"
          header={manager.strings.TaskWrapup}
          subHeader={manager.strings.QueuesStatsSubHeaderNow}
          content={(queue: WorkerQueue) => {
            const wrappingTasks = queue.tasks_by_status?.wrapping || 0;
            return <span>{wrappingTasks}</span>;
          }}
        />,
        { sortOrder: 0 },
      );
    }
  }
};
