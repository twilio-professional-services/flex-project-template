import * as Flex from '@twilio/flex-ui';
import merge from 'lodash/merge';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { CustomWorkerAttributes } from 'types/task-router/Worker';

const manager = Flex.Manager.getInstance();
const { custom_data: globalSettings } = manager.configuration as UIAttributes;
export const defaultLanguage = 'en-US';

/**
 * Fetches the `custom_data` object from the hosted Flex configuration,
 * providing all of the global feature configuration and global common
 * configuration for the template.
 * If running locally, any values contained within `appConfig.js` will also be
 * returned, overriding the corresponding hosted Flex configuration values.
 */
export const getFeatureFlagsGlobal = () => {
  return globalSettings;
};

/**
 * Fetches the `config_overrides` object from the current worker's attributes.
 * This object contains any configuration values that were set on the worker
 * level, overriding the corresponding global configuration values.
 */
export const getFeatureFlagsUser = () => {
  const { config_overrides: workerSettings } = manager.workerClient?.attributes as CustomWorkerAttributes;
  return workerSettings;
};

const mergedSettings = merge(globalSettings, getFeatureFlagsUser());

/**
 * Returns the complete effective configuration. **This is the function you
 * should use in most cases when determining a configuration value.** For each
 * configuration value, the value returned will be as follows:
 * - If a override has been configured on the worker, that will be returned.
 * - If no worker override has been configured, and the plugin is running
 * locally, and the value is configured in `appConfig.js`, the value from
 * `appConfig.js` will be returned.
 * - Otherwise, the hosted Flex configuration value will be returned.
 */
export const getFeatureFlags = () => {
  return mergedSettings;
};

/**
 * Returns the currently configured language, using the same order of
 * precedence as `getFeatureFlags`. If the configured value is `default`, the
 * browser's language will be returned. Otherwise, if no value is configured,
 * `en-US` will be returned.
 */
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
