import { ITask } from '@twilio/flex-ui';

import AgentAutomationConfig, { TaskQualificationConfig } from './types/ServiceConfiguration';
import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, configuration = [] } =
  (getFeatureFlags()?.features?.agent_automation as AgentAutomationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getMatchingTaskConfiguration = (task: ITask): TaskQualificationConfig | null => {
  const { taskChannelUniqueName: channel } = task;
  const attributes = task.attributes as any;
  let first_matched_config = null as TaskQualificationConfig | null;

  configuration.forEach((config) => {
    let matched_config = true;
    if (config.channel === channel) {
      config.required_attributes?.forEach((required_attribute) => {
        if (attributes[required_attribute.key] !== required_attribute.value) {
          matched_config = false;
        }
      });
      if (matched_config && !first_matched_config) {
        first_matched_config = config;
      }
    }
  });

  return first_matched_config;
};
