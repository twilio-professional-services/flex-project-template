import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false, filter_teams_view = false, rules } = custom_data?.features?.activity_skill_filter || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isFilterTeamsViewEnabled = () => {
  return enabled && filter_teams_view;
};

export const getRules = () => {
  return rules;
};