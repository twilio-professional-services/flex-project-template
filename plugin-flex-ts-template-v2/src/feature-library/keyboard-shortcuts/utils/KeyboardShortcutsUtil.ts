import * as Flex from '@twilio/flex-ui';

import { ShortcutsObject, CustomShortcut } from '../types/types';
import { RemapShortcutObject, ShortcutActions } from '../types/types';
import { KeyboardShortcuts } from '@twilio/flex-ui/src/KeyboardShortcuts';

import { readFromLocalStorage } from './LocalStorageUtil';
import { presetCustomShortcuts } from './CustomKeyboardShortcuts';
import { deleteMultipleFromLocalStorage } from './LocalStorageUtil';

import { shortcutsConfig } from './constants';
import { deleteShortcuts } from './constants';
import { enableThrottling } from './constants';
import { removeAllShortcuts } from './constants';

export const getCurrentShortcuts = (): KeyboardShortcuts => {
  return Flex.KeyboardShortcutManager.keyboardShortcuts;
};

export const shortcutInitUtil = (keyboardShortcuts: KeyboardShortcuts) => {
  Flex.KeyboardShortcutManager.init(keyboardShortcuts);
};

export const deleteShortcutsUtil = (shortcut: string): void => {
  Flex.KeyboardShortcutManager.deleteShortcuts([shortcut]);
};

export const disableKeyboardShortcutsUtil = (): void => {
  Flex.KeyboardShortcutManager.disableShortcuts();
};

export const resetKeyboardShortcutsUtil = (): void => {
  disableKeyboardShortcutsUtil();
  deleteMultipleFromLocalStorage([
    deleteShortcuts,
    enableThrottling,
    removeAllShortcuts,
    shortcutsConfig,
  ]);
  shortcutInitUtil(Flex.defaultKeyboardShortcuts);
};

export const addKeyboardShortcutUtil = (
  shortcutObject: KeyboardShortcuts
): void => {
  Flex.KeyboardShortcutManager.addShortcuts(shortcutObject);
};

export const remapKeyboardShortcutUtil = (
  oldKey: string,
  newKey: string,
  shortcutObject: RemapShortcutObject
): void => {
  Flex.KeyboardShortcutManager.remapShortcut(
    oldKey,
    typeof newKey === 'string' ? newKey.toUpperCase() : newKey,
    shortcutObject
  );
};

export const initCustomShortcuts = (): CustomShortcut[] => {
  const customShortcutsValues = Object.entries(presetCustomShortcuts).map(
    (item): CustomShortcut => {
      return {
        key: item[0],
        actionName: item[1].name,
        throttle: item[1]?.throttle,
      };
    }
  );

  return customShortcutsValues;
};

export const getAllShortcuts = (): ShortcutsObject[] => {
  const shortcutValues = Object.entries(getCurrentShortcuts()).map(
    (item): ShortcutsObject => {
      return {
        key: item[0],
        actionName: item[1].name,
        throttle: item[1]?.throttle,
        action: item[1].action,
      };
    }
  );

  return shortcutValues;
};

export const getDefaultShortcuts = (): ShortcutsObject[] => {
  getUserConfig();
  const customShortcuts = initCustomShortcuts();
  const allShortcuts = getAllShortcuts();

  const customShortcutsKeys = Object.values(customShortcuts).map(
    item => item.actionName
  );

  const defaultShortcutValues = allShortcuts.filter(
    item => customShortcutsKeys.indexOf(item.actionName) === -1
  );

  return defaultShortcutValues;
};

export const getCustomShortcuts = (): ShortcutsObject[] => {
  getUserConfig();
  if (readFromLocalStorage(shortcutsConfig) === (undefined || null)) {
    addKeyboardShortcutUtil(presetCustomShortcuts);
  }

  const customShortcuts = initCustomShortcuts();
  const allShortcuts = getAllShortcuts();

  const customShortcutsKeys = Object.values(customShortcuts).map(
    item => item.actionName
  );

  const customShortcutValues = allShortcuts.filter(
    item => customShortcutsKeys.indexOf(item.actionName) !== -1
  );

  return customShortcutValues;
};

export const getUserConfig = (): void => {
  const localConfig = readFromLocalStorage(shortcutsConfig);

  if (localConfig) {
    addKeyboardShortcutUtil(presetCustomShortcuts);
    const userLocalConfig: ShortcutsObject = JSON.parse(localConfig);
    const systemConfig = getCurrentShortcuts();

    const userLocalConfigArray = Object.entries(userLocalConfig).map(item => {
      return {
        key: item[0],
        actionName: item[1].name,
        throttle: item[1]?.throttle,
      };
    });

    const systemConfigArray = Object.entries(systemConfig).map(
      (item): ShortcutsObject => {
        return {
          key: item[0],
          actionName: item[1].name,
          throttle: item[1]?.throttle,
          action: item[1].action,
        };
      }
    );

    const userConfig = systemConfigArray.map(systemItem => {
      const foundItem = userLocalConfigArray.find(
        userItem => userItem.actionName === systemItem.actionName
      );
      if (foundItem) {
        return {
          ...foundItem,
          action: systemItem.action,
          oldKey: systemItem.key,
          delete: false,
        };
      } else {
        return { ...systemItem, oldKey: systemItem.key, delete: true };
      }
    });

    disableKeyboardShortcutsUtil();

    userConfig.forEach(shortcut => {
      Flex.KeyboardShortcutManager.remapShortcut(
        shortcut.oldKey,
        shortcut.key,
        {
          action: shortcut.action,
          name: shortcut.actionName,
          throttle: shortcut.throttle,
        }
      );

      if (shortcut.delete === true) {
        deleteShortcutsUtil(shortcut.key);
      }
    });

    shortcutInitUtil(Flex.KeyboardShortcutManager.keyboardShortcuts);
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

  const allActions = allShortcuts.map(item => {
    return {
      [getCamelCase(item.actionName)]: item.action,
    };
  });

  return Object.assign({}, ...allActions);
};
