import {  isDepartmentFilterEnabled, isExtensionsFilterEnabled, isQueueNoWorkerDataFilterEnabled, isQueueWorkerDataFilterEnabled, isTeamFilterEnabled, isAgentSkillsFilterEnabled } from "../../config";

import { departmentFilter } from "../../filters/departmentFilter";
import { emailFilter } from "../../filters/emailFilter";
import { queueNoWorkerDataFilter } from "../../filters/queueNoWorkerDataFilter";
import { queueWorkerDataFilter } from "../../filters/queueWorkerDataFilter";
import { teamFilter } from "../../filters/teamFilter";
import { agentSkillsFilter } from "../../filters/agentSkillsFilter"
import { FilterDefinition } from "@twilio/flex-ui";

export const teamsFilterHook = async function getSampleFilters() {

  var enabledFilters = [] as Array<FilterDefinition>;
  
  isDepartmentFilterEnabled() ? enabledFilters.push(departmentFilter()) : null;
  isExtensionsFilterEnabled() ? enabledFilters.push(emailFilter()) : null;
  isQueueNoWorkerDataFilterEnabled() ? enabledFilters.push(await queueNoWorkerDataFilter()) : null;
  isQueueWorkerDataFilterEnabled() ? enabledFilters.push(await queueWorkerDataFilter()) : null
  isTeamFilterEnabled() ? enabledFilters.push(teamFilter()) : null;
  isAgentSkillsFilterEnabled() ? enabledFilters.push(agentSkillsFilter()) : null;

  return enabledFilters;
};
