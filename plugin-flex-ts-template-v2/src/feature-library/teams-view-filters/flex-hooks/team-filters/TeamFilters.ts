import * as Flex from "@twilio/flex-ui";
import {  isFeatureEnabled } from "../../index";

import { companyFilter } from "../../filters/companyFilter";
import { departmentFilter } from "../../filters/departmentFilter";
import { extensionFilter } from "../../filters/extensionFilter";
import { queueFilter } from "../../filters/queueFilter";
import { teamFilter } from "../../filters/teamFilter";

//TODO - add configuration lookup to select which filters to load
const enabledFilters = [
  companyFilter,
  departmentFilter,
  extensionFilter,
  queueFilter,
  teamFilter
];

const loadSampleFilters = async (flex: typeof Flex) => {
  if (!isFeatureEnabled()) return;
  
  flex.TeamsView.defaultProps.filters = [
    flex.TeamsView.activitiesFilter,
    ...enabledFilters
  ];
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  loadSampleFilters(flex);
};
