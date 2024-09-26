import * as Flex from '@twilio/flex-ui';
import { KeyboardShortcuts } from '@twilio/flex-ui/src/KeyboardShortcuts';

let keyboardShortcuts = {} as KeyboardShortcuts;

export const init = (flex: typeof Flex, manager: Flex.Manager) => {
  // Fetch manager strings after string hooks have executed
  for (const [, value] of Object.entries(keyboardShortcuts)) {
    const managerString = (manager.strings as any)[value.name];
    if (managerString) {
      value.name = managerString;
    }
  }
  flex.KeyboardShortcutManager.addShortcuts(keyboardShortcuts);
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(
    `Feature ${feature} registered keyboard shortcut hook: %c${hook.keyboardShortcutHook.name}`,
    'font-weight:bold',
  );
  // Returns object with keyboard shortcut definitions to register
  const hookShortcuts = hook.keyboardShortcutHook(flex, manager) as KeyboardShortcuts;
  for (const [key, value] of Object.entries(hookShortcuts)) {
    if (
      Object.keys(flex.KeyboardShortcutManager.keyboardShortcuts).includes(key) ||
      Object.keys(keyboardShortcuts).includes(key)
    ) {
      console.error(`Unable to register duplicate keyboard shortcut for key "${key}"`);
      continue;
    }
    keyboardShortcuts = {
      ...keyboardShortcuts,
      [key]: value,
    };
  }
};
