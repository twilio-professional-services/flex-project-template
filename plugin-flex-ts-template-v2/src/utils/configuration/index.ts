import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { CustomWorkerAttributes } from 'types/task-router/Worker';

export const defaultLanguage = 'en-US';

export const getFeatureFlags = () => {
  const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
  return custom_data;
};

export const getUserLanguage = () => {
  const workerClient = Flex.Manager.getInstance().workerClient;
  let { language } = getFeatureFlags();

  if (workerClient) {
    // get user-specified language if present, instead of global language
    const workerAttrs = workerClient.attributes as CustomWorkerAttributes;
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
