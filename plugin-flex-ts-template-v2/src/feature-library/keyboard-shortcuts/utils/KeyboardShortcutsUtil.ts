// @ts-nocheck
import * as Flex from '@twilio/flex-ui';
import { KeyboardShortcuts } from '@twilio/flex-ui/src/KeyboardShortcuts';

import { validateUiVersion } from '../../../utils/configuration';
import { ShortcutsObject, RemapShortcutObject, ShortcutActions } from '../types/types';
import { readFromLocalStorage, deleteMultipleFromLocalStorage } from './LocalStorageUtil';
import { shortcutsConfig, deleteShortcuts, enableThrottling, removeAllShortcuts } from './constants';

const initialShortcuts: KeyboardShortcuts = {};

export const isSupported = (): boolean => {
  return validateUiVersion('>=2.1');
};

export const initialize = () => {
  // Clone the initial shortcuts state before we remap them
  for (const [key, value] of Object.entries(getCurrentShortcuts())) {
    initialShortcuts[key] = {
      name: value.name,
      throttle: value.throttle,
      action: value.action,
    };
  }
  getUserConfig();
};

export const getCurrentShortcuts = (): KeyboardShortcuts => {
  return Flex.KeyboardShortcutManager.keyboardShortcuts;
};

export const replaceShortcuts = (keyboardShortcuts: KeyboardShortcuts) => {
  Flex.KeyboardShortcutManager.init(keyboardShortcuts);
};

export const deleteShortcut = (shortcutKey: string): void => {
  Flex.KeyboardShortcutManager.deleteShortcuts([shortcutKey]);
};

export const disableAllShortcuts = (): void => {
  Flex.KeyboardShortcutManager.disableShortcuts();
};

export const resetShortcuts = (): void => {
  disableAllShortcuts();
  deleteMultipleFromLocalStorage([deleteShortcuts, enableThrottling, removeAllShortcuts, shortcutsConfig]);
  replaceShortcuts(initialShortcuts);
};

export const remapShortcut = (oldKey: string, newKey: string, shortcutObject: RemapShortcutObject): void => {
  Flex.KeyboardShortcutManager.remapShortcut(
    oldKey,
    typeof newKey === 'string' ? newKey.toUpperCase() : newKey,
    shortcutObject,
  );
};

export const getAllShortcuts = (): ShortcutsObject[] => {
  return Object.entries(getCurrentShortcuts()).map((item): ShortcutsObject => {
    return {
      key: item[0],
      actionName: item[1].name,
      throttle: item[1]?.throttle,
      action: item[1].action,
    };
  });
};

export const getShortcuts = (getCustom: boolean): ShortcutsObject[] => {
  const allShortcuts = getAllShortcuts();

  const defaultShortcutsKeys = Object.values(Flex.defaultKeyboardShortcuts).map((item) => item.name);

  if (getCustom) {
    return allShortcuts.filter((item) => defaultShortcutsKeys.indexOf(item.actionName) === -1);
  }
  return allShortcuts.filter((item) => defaultShortcutsKeys.indexOf(item.actionName) !== -1);
};

export const getUserConfig = (): void => {
  const localConfig = readFromLocalStorage(shortcutsConfig);

  if (localConfig) {
    const userLocalConfig: ShortcutsObject = JSON.parse(localConfig);
    const systemConfig = getCurrentShortcuts();

    const userLocalConfigArray = Object.entries(userLocalConfig).map((item) => {
      return {
        key: item[0],
        actionName: item[1].name,
        throttle: item[1]?.throttle,
      };
    });

    const systemConfigArray = Object.entries(systemConfig).map((item): ShortcutsObject => {
      return {
        key: item[0],
        actionName: item[1].name,
        throttle: item[1]?.throttle,
        action: item[1].action,
      };
    });

    const userConfig = systemConfigArray.map((systemItem) => {
      const foundItem = userLocalConfigArray.find((userItem) => userItem.actionName === systemItem.actionName);
      if (foundItem) {
        return {
          ...foundItem,
          action: systemItem.action,
          oldKey: systemItem.key,
          delete: false,
        };
      }
      return { ...systemItem, oldKey: systemItem.key, delete: true };
    });

    userConfig.forEach((shortcut) => {
      Flex.KeyboardShortcutManager.remapShortcut(shortcut.oldKey, shortcut.key, {
        action: shortcut.action,
        name: shortcut.actionName,
        throttle: shortcut.throttle,
      });

      if (shortcut.delete === true) {
        deleteShortcut(shortcut.key);
      }
    });
  }
};

export const getCamelCase = (input: string): string =>
  input
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');

export const getAllActions = (): ShortcutActions => {
  const allShortcuts = getAllShortcuts();

  const allActions = allShortcuts.map((item) => {
    return {
      [getCamelCase(item.actionName)]: item.action,
    };
  });

  return Object.assign({}, ...allActions);
};
