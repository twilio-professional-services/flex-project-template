import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { Worker } from '../../../../types/task-router';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';
import {
  isTeamColumnEnabled,
  isDepartmentColumnEnabled,
  isLocationColumnEnabled,
  isAgentSkillsColumnEnabled,
} from '../../config';

interface WorkerItem {
  worker: Worker;
}

const getSkills = (item: WorkerItem) => {
  return item.worker.attributes.routing ? item.worker?.attributes?.routing?.skills?.join(', ') : '-';
};

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addWorkersDataTableColumns(flex: typeof Flex, manager: Flex.Manager) {
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="team"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnTeamName]}
      content={(item: WorkerItem) => item.worker.attributes.team_name}
    />,
    { sortOrder: 4, if: () => isTeamColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="department"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnDepartment]}
      content={(item: WorkerItem) => item.worker.attributes.department_name}
    />,
    { sortOrder: 5, if: () => isDepartmentColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="location"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnLocation]}
      content={(item: WorkerItem) => item.worker.attributes.location}
    />,
    { sortOrder: 6, if: () => isLocationColumnEnabled() },
  );
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="skills"
      header={(manager.strings as any)[StringTemplates.TeamsViewColumnSkills]}
      content={(item: WorkerItem) => getSkills(item)}
    />,
    { sortOrder: 7, if: () => isAgentSkillsColumnEnabled() },
  );
};
