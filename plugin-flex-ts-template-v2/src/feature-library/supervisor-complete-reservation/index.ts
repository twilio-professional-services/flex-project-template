import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.supervisor_complete_reservation || {};
const { enabled:supervisor_barge_coach_enabled = false } = getFeatureFlags()?.features?.supervisor_barge_coach || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isSupervisorBargeCoachEnabled = () => {
  return supervisor_barge_coach_enabled;
}


