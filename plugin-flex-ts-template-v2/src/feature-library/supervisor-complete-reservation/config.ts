import { getFeatureFlags } from '../../utils/configuration';
import SupervisorCompleteReservation from './types/ServiceConfiguration';

const { enabled = false } =
  (getFeatureFlags()?.features?.supervisor_complete_reservation as SupervisorCompleteReservation) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
