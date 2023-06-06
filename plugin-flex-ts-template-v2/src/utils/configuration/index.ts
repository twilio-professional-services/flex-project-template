import * as Flex from '@twilio/flex-ui';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

export const defaultLanguage = 'en-US';

export const getFeatureFlags = () => {
  const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
  return custom_data;
};

export const getUserLanguage = () => {
  const { language } = getFeatureFlags();

  if (!language) {
    return defaultLanguage;
  }

  if (language === 'default') {
    return navigator.language;
  }

  return language;
};
