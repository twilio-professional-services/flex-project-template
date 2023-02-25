import { getFeatureFlags } from '../../utils/configuration';
import SupervisorCompleteReservation from './types/ServiceConfiguration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.supervisor_complete_reservation as SupervisorCompleteReservation || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("supervisor-complete-reservation", hooks);
};
