import * as Flex from '@twilio/flex-ui';

import * as KeyboardShortcuts from './keyboard-shortcuts';
import { resetState } from './keyboard-shortcuts';

// Mock Flex with Manager and KeyboardShortcutManager
jest.mock('@twilio/flex-ui', () => ({
  Manager: {
    getInstance: jest.fn(() => ({
      strings: {
        CustomShortcut: 'Custom Shortcut Label',
        AnotherShortcut: 'Another Shortcut Label',
      },
    })),
  },
  KeyboardShortcutManager: {
    addShortcuts: jest.fn(),
    keyboardShortcuts: {
      // Existing built-in shortcuts
      AcceptTask: {
        key: 'a',
        name: 'Accept Task',
      },
    },
  },
}));

// Get reference to mocked manager
const mockManager = Flex.Manager.getInstance() as Flex.Manager;

describe('utils/feature-loader/keyboard-shortcuts', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    resetState();

    // Spy on console methods
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('addHook', () => {
    it('should add new keyboard shortcuts', () => {
      const hook = {
        keyboardShortcutHook: jest.fn(() => ({
          NewShortcut: {
            key: 'n',
            name: 'NewShortcutLabel',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.keyboardShortcutHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Feature test-feature registered keyboard shortcut hook/),
        expect.any(String),
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should prevent duplicate shortcuts that conflict with built-in shortcuts', () => {
      const hook = {
        keyboardShortcutHook: jest.fn(() => ({
          AcceptTask: {
            key: 'a',
            name: 'My Custom Accept Task',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unable to register duplicate keyboard shortcut for key "AcceptTask"'),
      );
    });

    it('should prevent duplicate shortcuts registered by different features', () => {
      const hook1 = {
        keyboardShortcutHook: jest.fn(() => ({
          CustomShortcut: {
            key: 'c',
            name: 'Custom Shortcut',
          },
        })),
      };

      const hook2 = {
        keyboardShortcutHook: jest.fn(() => ({
          CustomShortcut: {
            key: 'x',
            name: 'Another Custom Shortcut',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'feature-1', hook1);
      KeyboardShortcuts.addHook(Flex, mockManager, 'feature-2', hook2);

      // First hook should succeed
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('feature-1'), expect.anything());

      // Second hook should error due to duplicate key
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unable to register duplicate keyboard shortcut for key "CustomShortcut"'),
      );
    });

    it('should accumulate multiple non-conflicting shortcuts', () => {
      const hook1 = {
        keyboardShortcutHook: jest.fn(() => ({
          Shortcut1: {
            key: '1',
            name: 'First Shortcut',
          },
        })),
      };

      const hook2 = {
        keyboardShortcutHook: jest.fn(() => ({
          Shortcut2: {
            key: '2',
            name: 'Second Shortcut',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'feature-1', hook1);
      KeyboardShortcuts.addHook(Flex, mockManager, 'feature-2', hook2);

      expect(hook1.keyboardShortcutHook).toHaveBeenCalled();
      expect(hook2.keyboardShortcutHook).toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle hooks that return multiple shortcuts', () => {
      // Reset module state to clear any previously registered shortcuts
      resetState();

      const hook = {
        keyboardShortcutHook: jest.fn(() => ({
          UniqueShortcut1: {
            key: '1',
            name: 'First',
          },
          UniqueShortcut2: {
            key: '2',
            name: 'Second',
          },
          UniqueShortcut3: {
            key: '3',
            name: 'Third',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'multi-shortcut-feature', hook);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle empty shortcut dictionaries', () => {
      const hook = {
        keyboardShortcutHook: jest.fn(() => ({})),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'empty-feature', hook);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log hook name from keyboardShortcutHook function', () => {
      const namedFunction = function myKeyboardShortcutHook() {
        return {
          TestShortcut: { key: 't', name: 'Test' },
        };
      };

      const hook = {
        keyboardShortcutHook: namedFunction,
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/myKeyboardShortcutHook/), expect.any(String));
    });
  });

  describe('init', () => {
    beforeEach(() => {
      // Reset module state before each test in this describe block
      resetState();
    });

    it('should register accumulated shortcuts with KeyboardShortcutManager', () => {
      const hook = {
        keyboardShortcutHook: jest.fn(() => ({
          CustomShortcut: {
            key: 'c',
            name: 'CustomShortcut',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'test-feature', hook);
      KeyboardShortcuts.init(Flex, mockManager);

      expect(Flex.KeyboardShortcutManager.addShortcuts).toHaveBeenCalledWith(
        expect.objectContaining({
          CustomShortcut: expect.objectContaining({
            key: 'c',
          }),
        }),
      );
    });

    it('should replace shortcut name with translated string from manager.strings', () => {
      const hook = {
        keyboardShortcutHook: jest.fn(() => ({
          CustomShortcut: {
            key: 'c',
            name: 'CustomShortcut', // This should be replaced with 'Custom Shortcut Label' from manager.strings
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'test-feature', hook);
      KeyboardShortcuts.init(Flex, mockManager);

      expect(Flex.KeyboardShortcutManager.addShortcuts).toHaveBeenCalledWith(
        expect.objectContaining({
          CustomShortcut: expect.objectContaining({
            name: 'Custom Shortcut Label', // Translated from manager.strings
          }),
        }),
      );
    });

    it('should keep original name if no translation exists in manager.strings', () => {
      const hook = {
        keyboardShortcutHook: jest.fn(() => ({
          UntranslatedShortcut: {
            key: 'u',
            name: 'Original Untranslated Name',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'test-feature', hook);
      KeyboardShortcuts.init(Flex, mockManager);

      expect(Flex.KeyboardShortcutManager.addShortcuts).toHaveBeenCalledWith(
        expect.objectContaining({
          UntranslatedShortcut: expect.objectContaining({
            name: 'Original Untranslated Name', // No translation available
          }),
        }),
      );
    });

    it('should handle init with no registered shortcuts', () => {
      KeyboardShortcuts.init(Flex, mockManager);

      expect(Flex.KeyboardShortcutManager.addShortcuts).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should translate multiple shortcuts', () => {
      const hook = {
        keyboardShortcutHook: jest.fn(() => ({
          CustomShortcut: {
            key: 'c',
            name: 'CustomShortcut',
          },
          AnotherShortcut: {
            key: 'a',
            name: 'AnotherShortcut',
          },
        })),
      };

      KeyboardShortcuts.addHook(Flex, mockManager, 'test-feature', hook);
      KeyboardShortcuts.init(Flex, mockManager);

      expect(Flex.KeyboardShortcutManager.addShortcuts).toHaveBeenCalledWith(
        expect.objectContaining({
          CustomShortcut: expect.objectContaining({
            name: 'Custom Shortcut Label',
          }),
          AnotherShortcut: expect.objectContaining({
            name: 'Another Shortcut Label',
          }),
        }),
      );
    });
  });
});
