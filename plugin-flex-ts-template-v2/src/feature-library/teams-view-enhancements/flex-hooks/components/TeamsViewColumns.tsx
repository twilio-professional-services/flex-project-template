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
  isAgentCapacityColumnEnabled,
} from '../../config';

interface WorkerItem {
  worker: Worker;
}

const getSkills = (item: WorkerItem) => {
  return item.worker.attributes.routing ? item.worker?.attributes?.routing?.skills?.join(', ') : '-';
};

const getCapacity = (item: WorkerItem) => {
  let chatCapacity: number = 0;
  let smsCapacity: number = 0;
  const wkCh = item.worker?.attributes?.channels;
  if (wkCh) {
    chatCapacity = wkCh?.chat?.available && wkCh?.chat?.capacity ? wkCh.chat.capacity : 0;
    smsCapacity = wkCh?.sms?.available && wkCh?.sms?.capacity ? wkCh.sms.capacity : 0;
  }
  return (
    <span>
      Chat: {chatCapacity} <br /> SMS: {smsCapacity}{' '}
    </span>
  );
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
  flex.WorkersDataTable.Content.add(
    <flex.ColumnDefinition
      key="capacity"
      header={(manager.strings as any)[StringTemplates.ChannelCapacityTitle]}
      content={(item: WorkerItem) => getCapacity(item)}
    />,
    { sortOrder: 8, if: () => isAgentCapacityColumnEnabled() },
  );
};
