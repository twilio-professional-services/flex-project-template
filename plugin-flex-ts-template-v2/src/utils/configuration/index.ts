import * as Flex from '@twilio/flex-ui';
import merge from 'lodash/merge';

import { UIAttributes } from '../../types/manager/ServiceConfiguration';
import { CustomWorkerAttributes } from '../../types/task-router/Worker';

const manager = Flex.Manager.getInstance();
const { custom_data: globalSettings } = manager.configuration as UIAttributes;

let loadedFeaturesPopulated = false;
// Populated by the feature loader after each feature loads. Note: Do not access during initialization before all features have loaded, or the array will be incomplete!
const loadedFeatures: string[] = [];

export const getLoadedFeatures = () => {
  if (!loadedFeaturesPopulated) {
    console.error('Caution! getLoadedFeatures() was called before all features were loaded, so none will be returned.');
    return [];
  }
  return loadedFeatures;
};

export const addLoadedFeature = (feature: string) => {
  loadedFeatures.push(feature);
};

export const setLoadedFeaturesPopulated = (populated: boolean) => {
  loadedFeaturesPopulated = populated;
};

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
