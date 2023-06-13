import * as Flex from '@twilio/flex-ui';
import { merge } from 'lodash';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { CustomWorkerAttributes } from 'types/task-router/Worker';

const manager = Flex.Manager.getInstance();
const { custom_data: globalSettings } = manager.configuration as UIAttributes;
export const defaultLanguage = 'en-US';

export const getFeatureFlagsGlobal = () => {
  return globalSettings;
};

export const getFeatureFlagsUser = () => {
  const { config_overrides: workerSettings } = manager.workerClient?.attributes as CustomWorkerAttributes;
  return workerSettings;
};

const mergedSettings = merge(globalSettings, getFeatureFlagsUser());

export const getFeatureFlags = () => {
  return mergedSettings;
};

export const getUserLanguage = () => {
  let { language } = getFeatureFlags();

  if (manager.workerClient) {
    // get user-specified language if present, instead of global language
    const workerAttrs = manager.workerClient.attributes as CustomWorkerAttributes;
    if (workerAttrs.language) {
      language = workerAttrs.language;
    }
  }

  if (!language) {
    return defaultLanguage;
  }

  if (language === 'default') {
    return navigator.language;
  }

  return language;
};
