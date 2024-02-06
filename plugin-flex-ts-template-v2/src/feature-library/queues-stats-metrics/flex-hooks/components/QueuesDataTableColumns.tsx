import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';

import { FlexComponent } from '../../../../types/feature-loader';
import {
  isAssignedTasksColumnEnabled,
  isWrappingTasksColumnEnabled,
  iAgentActivityStatsColumnEnabled,
} from '../../config';
import { StringTemplates } from '../strings';
import { isColumnDescriptionSupported } from '../../utils/helpers';
import QueueActivityStats from './QueueActivityStats/QueueActivityStats';

export const componentName = FlexComponent.QueueStats;
export const componentHook = function addQueuesDataTableColumns(flex: typeof Flex, manager: Flex.Manager) {
  if (isAssignedTasksColumnEnabled()) {
    const props: any = {};
    if (isColumnDescriptionSupported()) {
      props.description = (manager.strings as any)[StringTemplates.AssignedTasksMetric];
    }
    flex.QueuesStats.QueuesDataTable.Content.add(
      <flex.ColumnDefinition
        key="assigned-tasks"
        header={manager.strings.TaskAssigned}
        subHeader={manager.strings.QueuesStatsSubHeaderNow}
        content={(queue: WorkerQueue) => {
          const assignedTasks = queue.tasks_by_status?.assigned || 0;
          return <span>{assignedTasks}</span>;
        }}
        {...props}
      />,
      { sortOrder: 0 },
    );
  }
  if (isWrappingTasksColumnEnabled()) {
    const props: any = {};
    if (isColumnDescriptionSupported()) {
      props.description = (manager.strings as any)[StringTemplates.WrappingTasksMetric];
    }
    flex.QueuesStats.QueuesDataTable.Content.add(
      <flex.ColumnDefinition
        key="wrapping-tasks"
        header={manager.strings.TaskWrapup}
        subHeader={manager.strings.QueuesStatsSubHeaderNow}
        content={(queue: WorkerQueue) => {
          const wrappingTasks = queue.tasks_by_status?.wrapping || 0;
          return <span>{wrappingTasks}</span>;
        }}
        {...props}
      />,
      { sortOrder: 0 },
    );
  }
  if (iAgentActivityStatsColumnEnabled()) {
    const props: any = {};
    if (isColumnDescriptionSupported()) {
      props.description = (manager.strings as any)[StringTemplates.AgentActivityDescription];
    }
    flex.QueuesStats.QueuesDataTable.Content.add(
      <flex.ColumnDefinition
        key="activity-counts"
        header={(manager.strings as any)[StringTemplates.AgentActivityHeader]}
        subHeader={manager.strings.QueuesStatsSubHeaderNow}
        content={(queue: WorkerQueue) => {
          return <QueueActivityStats queueName={queue.friendly_name} activityStats={queue.activity_statistics} />;
        }}
        {...props}
      />,
      { sortOrder: 0 },
    );
  }
};
