import { getFeatureFlags } from '../../utils/configuration';
import QueuesStatsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  assigned_tasks_column = true,
  wrapping_tasks_column = true,
  agent_activity_stats_column = true,
} = (getFeatureFlags()?.features?.queues_stats_metrics as QueuesStatsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAssignedTasksColumnEnabled = () => {
  return assigned_tasks_column;
};
export const isWrappingTasksColumnEnabled = () => {
  return wrapping_tasks_column;
};
export const iAgentActivityStatsColumnEnabled = () => {
  return agent_activity_stats_column;
};
