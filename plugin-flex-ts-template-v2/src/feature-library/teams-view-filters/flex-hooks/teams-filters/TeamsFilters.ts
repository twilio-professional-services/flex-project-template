import { FilterDefinition } from '@twilio/flex-ui';

import {
  isDepartmentFilterEnabled,
  isEmailFilterEnabled,
  isQueueNoWorkerDataFilterEnabled,
  isQueueWorkerDataFilterEnabled,
  isTeamFilterEnabled,
  isAgentSkillsFilterEnabled,
} from '../../config';
import { departmentFilter } from '../../filters/departmentFilter';
import { emailFilter } from '../../filters/emailFilter';
import { queueNoWorkerDataFilter } from '../../filters/queueNoWorkerDataFilter';
import { queueWorkerDataFilter } from '../../filters/queueWorkerDataFilter';
import { teamFilter } from '../../filters/teamFilter';
import { agentSkillsFilter } from '../../filters/agentSkillsFilter';

export const teamsFilterHook = async function getSampleFilters() {
  const enabledFilters = [] as Array<FilterDefinition>;

  if (isDepartmentFilterEnabled()) {
    enabledFilters.push(departmentFilter());
  }

  if (isEmailFilterEnabled()) {
    enabledFilters.push(emailFilter());
  }

  if (isQueueNoWorkerDataFilterEnabled()) {
    enabledFilters.push(await queueNoWorkerDataFilter());
  }

  if (isQueueWorkerDataFilterEnabled()) {
    enabledFilters.push(await queueWorkerDataFilter());
  }

  if (isTeamFilterEnabled()) {
    enabledFilters.push(teamFilter());
  }

  if (isAgentSkillsFilterEnabled()) {
    enabledFilters.push(agentSkillsFilter());
  }

  return enabledFilters;
};
