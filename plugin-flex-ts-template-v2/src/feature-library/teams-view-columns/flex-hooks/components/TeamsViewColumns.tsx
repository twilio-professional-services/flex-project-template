import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { Worker } from '../../../../types/task-router';
import { FlexComponent } from '../../../../types/feature-loader';

interface WorkerItem {
  worker: Worker
}

const getSkills = (item: WorkerItem) => {
  return item.worker.attributes.routing ?
    item.worker?.attributes?.routing?.skills?.join(' / ') : 'NONE'
}
export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addWorkersDataTableColumns(flex: typeof Flex) {

  flex.WorkersDataTable.Content.add(<flex.ColumnDefinition
    key="team"
    header={"Team"}
    style={{ width: 150 }}
    content={(item: WorkerItem) => item.worker.attributes.team_name}
  />, { sortOrder: 4 });

  flex.WorkersDataTable.Content.add(<flex.ColumnDefinition
    key="skills"
    header={"Skills"}
    style={{ width: 200 }}
    content={(item: WorkerItem) => getSkills(item)}
  />, { sortOrder: 5 });

};
