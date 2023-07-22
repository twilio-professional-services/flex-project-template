import { getFeatureFlags } from '../../utils/configuration';
import ActivityReservationHandlerConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  system_activity_names = {
    available: 'Available',
    onATask: 'On a Task',
    onATaskNoAcd: 'On a Task, No ACD',
    wrapup: 'Wrap Up',
    wrapupNoAcd: 'Wrap Up, No ACD',
  },
} = (getFeatureFlags()?.features?.activity_reservation_handler as ActivityReservationHandlerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getSystemActivityNames = () => {
  return system_activity_names;
};
