import { companyFilter } from "./filters/companyFilter";
import { departmentFilter } from "./filters/departmentFilter";
import { extensionFilter } from "./filters/extensionFilter";
import { queueFilter } from "./filters/queueFilter";
import { teamFilter } from "./filters/teamFilter";

export const enabledFilters = [
  companyFilter,
  departmentFilter,
  extensionFilter,
  queueFilter,
  teamFilter
];