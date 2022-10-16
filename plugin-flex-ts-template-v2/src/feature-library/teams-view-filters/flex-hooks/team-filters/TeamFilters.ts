import * as Flex from "@twilio/flex-ui";
import {  isFeatureEnabled, isDepartmentFilterEnabled, isExtensionsFilterEnabled, isQueueFilterEnabled, isTeamFilterEnabled, isAgnetSkillsFilterEnabled } from "../../index";

import { departmentFilter } from "../../filters/departmentFilter";
import { emailFilter } from "../../filters/emailFilter";
import { queueFilter } from "../../filters/queueFilter";
import { teamFilter } from "../../filters/teamFilter";
import { agentSkillsFilter } from "../../filters/agentSkillsFilter"
import { FilterDefinition } from "@twilio/flex-ui";

const getSampleFilters = async () => {

  var enabledFilters = [] as Array<FilterDefinition>;

  if(isFeatureEnabled()) {
    isDepartmentFilterEnabled() ? enabledFilters.push(departmentFilter()) : null;isExtensionsFilterEnabled() ? enabledFilters.push(emailFilter()) : null;
    //isQueueFilterEnabled() ? enabledFilters.push(queueFilter()) : null;
    isTeamFilterEnabled() ? enabledFilters.push(teamFilter()) : null;
    isAgnetSkillsFilterEnabled() ? enabledFilters.push(agentSkillsFilter()) : null;
  }

  return enabledFilters;
};

export default getSampleFilters;
