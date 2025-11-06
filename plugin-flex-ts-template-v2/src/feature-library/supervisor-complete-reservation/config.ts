import { getFeatureFlags } from '../../utils/configuration';
import SupervisorCompleteReservation from './types/ServiceConfiguration';

const { enabled = false, outcome = 'Completed by supervisor' } =
  (getFeatureFlags()?.features?.supervisor_complete_reservation as SupervisorCompleteReservation) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getOutcome = () => {
  return outcome;
};
