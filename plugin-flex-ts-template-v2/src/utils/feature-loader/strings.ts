import * as Flex from '@twilio/flex-ui';

import logger from '../logger';
import { getUserLanguage, defaultLanguage } from '../configuration';

const userLanguage = getUserLanguage();

let customStrings = {};
let systemStrings = {};

export const init = (manager: Flex.Manager) => {
  manager.strings = {
    // -v- Add custom strings here -v-'
    ...customStrings,
    // -^---------------------------^-

    ...manager.strings,

    // -v- Modify strings provided by flex here -v-
    ...systemStrings,
    // -^----------------------------------------^-
  };
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  logger.debug(`Feature ${feature} registered string hook: ${hook.stringHook.name}`);
  // Returns dictionary of language and string definitions to register
  const hookLanguages = hook.stringHook(flex, manager);
  let hookStrings = {};

  if (hookLanguages[userLanguage] && hookLanguages[defaultLanguage] && userLanguage !== defaultLanguage) {
    // Include both default and user language to allow for incomplete translations
    hookStrings = { ...hookLanguages[defaultLanguage], ...hookLanguages[userLanguage] };
  } else if (hookLanguages[defaultLanguage]) {
    hookStrings = hookLanguages[defaultLanguage];
  } else {
    logger.error(
      `Feature ${feature} string hook is missing the user language (${userLanguage}) and the default language (${defaultLanguage}). Skipping.`,
    );
    return;
  }

  customStrings = {
    ...customStrings,
    ...hookStrings,
  };
};

export const addSystemHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  logger.debug(`Feature ${feature} registered system string hook: ${hook.systemStringHook.name}`);
  // Returns dictionary of language and string definitions to register
  const hookLanguages = hook.systemStringHook(flex, manager);
  let hookStrings = {};

  if (hookLanguages[userLanguage]) {
    hookStrings = hookLanguages[userLanguage];
  } else if (hookLanguages[defaultLanguage]) {
    hookStrings = hookLanguages[defaultLanguage];
  } else {
    logger.error(
      `Feature ${feature} system string hook is missing the user language (${userLanguage}) and the default language (${defaultLanguage}). Skipping.`,
    );
    return;
  }

  systemStrings = {
    ...systemStrings,
    ...hookStrings,
  };
};
