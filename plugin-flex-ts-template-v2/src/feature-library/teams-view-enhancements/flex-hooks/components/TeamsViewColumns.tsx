import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { CustomWorkerAttributes } from '../../../../types/task-router/Worker';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';
import {
  isTeamColumnEnabled,
  isDepartmentColumnEnabled,
  isLocationColumnEnabled,
  isActivityIconEnabled,
  getAgentActivityConfig,
} from '../../config';
import AgentActivityIcon from './AgentActivityIcon/AgentActivityIcon';

interface WorkerItem {
  worker: {
    attributes: CustomWorkerAttributes;
    activityName: string;
  };
}
const activityConfig = getAgentActivityConfig();

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addWorkersDataTableColumns(flex: typeof Flex, manager: Flex.Manager) {
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      style={{ width: 70 }}
      key="activity-icon-custom"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnActivity]}
      content={(item: WorkerItem) => (
        <AgentActivityIcon activityName={item.worker.activityName} activityConfig={activityConfig} />
      )}
    />,
    { sortOrder: 0, if: () => isActivityIconEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="team-custom"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnTeamName]}
      content={(item: WorkerItem) => item.worker.attributes.team_name}
    />,
    { sortOrder: 4, if: () => isTeamColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="department-custom"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnDepartment]}
      content={(item: WorkerItem) => item.worker.attributes.department_name}
    />,
    { sortOrder: 5, if: () => isDepartmentColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="location-custom"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnLocation]}
      content={(item: WorkerItem) => item.worker.attributes.location}
    />,
    { sortOrder: 6, if: () => isLocationColumnEnabled() },
  );
};
