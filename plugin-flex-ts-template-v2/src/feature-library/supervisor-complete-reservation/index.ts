import { getFeatureFlags } from '../../utils/configuration';
import SupervisorCompleteReservation from './types/ServiceConfiguration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.supervisor_complete_reservation as SupervisorCompleteReservation || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "supervisor-complete-reservation", hooks };
};
