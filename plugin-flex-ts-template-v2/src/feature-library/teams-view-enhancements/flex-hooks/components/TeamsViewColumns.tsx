import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { Worker } from '../../../../types/task-router';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';

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
      header={ (manager.strings as any) [StringTemplates.TeamsViewColumnTeamName] } 
      style={{ width: 150 }}
      content={(item: WorkerItem) => item.worker.attributes.team_name}
    />,
    { sortOrder: 4 },
  );

  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="skills"
      header={ (manager.strings as any) [StringTemplates.TeamsViewColumnSkills] } 
      style={{ width: 200 }}
      content={(item: WorkerItem) => getSkills(item)}
    />,
    { sortOrder: 5 },
  );
};
