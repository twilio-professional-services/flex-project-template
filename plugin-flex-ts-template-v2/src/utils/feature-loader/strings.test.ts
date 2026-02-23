import * as Flex from '@twilio/flex-ui';

import * as Strings from './strings';
import { resetState } from './strings';
import { getUserLanguage } from '../configuration';

// Mock Flex with Manager
const mockGetInstance = jest.fn();
jest.mock('@twilio/flex-ui', () => ({
  Manager: {
    getInstance: mockGetInstance,
  },
}));

// Mock configuration
jest.mock('../configuration', () => ({
  getUserLanguage: jest.fn(() => 'en-US'),
  defaultLanguage: 'en-US',
}));

describe('utils/feature-loader/strings', () => {
  let mockManager: Flex.Manager;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh manager for each test (tests modify manager.strings)
    mockManager = {
      strings: {
        existingString: 'Existing Value',
      },
    } as unknown as Flex.Manager;

    // Configure getInstance to return the current mockManager
    mockGetInstance.mockReturnValue(mockManager);

    // Spy on console methods
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('addHook', () => {
    it('should add strings when default language matches user language', () => {
      const hook = {
        stringHook: jest.fn(() => ({
          'en-US': {
            TestString: 'Test Value',
            AnotherString: 'Another Value',
          },
        })),
      };

      Strings.addHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.stringHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('test-feature'), expect.any(String));
    });

    it('should merge default and user language strings when both exist and differ', () => {
      (getUserLanguage as jest.Mock).mockReturnValueOnce('es-MX');

      const hook = {
        stringHook: jest.fn(() => ({
          'en-US': {
            Greeting: 'Hello',
            Farewell: 'Goodbye',
          },
          'es-MX': {
            Greeting: 'Hola',
            // Farewell not translated - should fall back to English
          },
        })),
      };

      Strings.addHook(Flex, mockManager, 'test-feature', hook);

      // The function merges both language dictionaries
      // Default language first, then user language (which overwrites matching keys)
      expect(hook.stringHook).toHaveBeenCalledWith(Flex, mockManager);
    });

    it('should use only default language when user language is not available', () => {
      (getUserLanguage as jest.Mock).mockReturnValueOnce('fr-FR');

      const hook = {
        stringHook: jest.fn(() => ({
          'en-US': {
            TestString: 'English Value',
          },
          // No fr-FR translation
        })),
      };

      Strings.addHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.stringHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log error when neither default nor user language is available', () => {
      (getUserLanguage as jest.Mock).mockReturnValueOnce('fr-FR');

      const hook = {
        stringHook: jest.fn(() => ({
          'es-MX': {
            TestString: 'Spanish Value',
          },
          // Missing both en-US and fr-FR
        })),
      };

      Strings.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Feature test-feature string hook is missing.*Skipping/),
      );
    });

    it('should handle empty string dictionaries', () => {
      const hook = {
        stringHook: jest.fn(() => ({
          'en-US': {},
        })),
      };

      Strings.addHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.stringHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should accumulate strings from multiple hook calls', () => {
      const hook1 = {
        stringHook: jest.fn(() => ({
          'en-US': {
            String1: 'Value 1',
          },
        })),
      };

      const hook2 = {
        stringHook: jest.fn(() => ({
          'en-US': {
            String2: 'Value 2',
          },
        })),
      };

      Strings.addHook(Flex, mockManager, 'feature-1', hook1);
      Strings.addHook(Flex, mockManager, 'feature-2', hook2);

      // Both hooks should be called
      expect(hook1.stringHook).toHaveBeenCalled();
      expect(hook2.stringHook).toHaveBeenCalled();
    });

    it('should log hook name from stringHook function', () => {
      const namedFunction = function myCustomStringHook() {
        return {
          'en-US': { Test: 'Value' },
        };
      };

      const hook = {
        stringHook: namedFunction,
      };

      Strings.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('myCustomStringHook'), expect.any(String));
    });
  });

  describe('addSystemHook', () => {
    it('should add system strings when user language is available', () => {
      const hook = {
        systemStringHook: jest.fn(() => ({
          'en-US': {
            SystemString: 'System Value',
          },
        })),
      };

      Strings.addSystemHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.systemStringHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Feature test-feature registered system string hook/),
        expect.any(String),
      );
    });

    it('should prefer user language over default language', () => {
      (getUserLanguage as jest.Mock).mockReturnValueOnce('es-MX');

      const hook = {
        systemStringHook: jest.fn(() => ({
          'en-US': {
            TaskHeaderLine: 'Task Information',
          },
          'es-MX': {
            TaskHeaderLine: 'Información de Tarea',
          },
        })),
      };

      Strings.addSystemHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.systemStringHook).toHaveBeenCalledWith(Flex, mockManager);
      // System strings prefer user language when available
    });

    it('should fall back to default language when user language is not available', () => {
      (getUserLanguage as jest.Mock).mockReturnValueOnce('fr-FR');

      const hook = {
        systemStringHook: jest.fn(() => ({
          'en-US': {
            TaskHeaderLine: 'Task Information',
          },
          // No fr-FR translation
        })),
      };

      Strings.addSystemHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.systemStringHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log error when neither user nor default language is available', () => {
      (getUserLanguage as jest.Mock).mockReturnValueOnce('fr-FR');

      const hook = {
        systemStringHook: jest.fn(() => ({
          'es-MX': {
            TaskHeaderLine: 'Información de Tarea',
          },
          // Missing both en-US and fr-FR
        })),
      };

      Strings.addSystemHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Feature test-feature system string hook is missing.*Skipping/),
      );
    });

    it('should handle empty system string dictionaries', () => {
      const hook = {
        systemStringHook: jest.fn(() => ({
          'en-US': {},
        })),
      };

      Strings.addSystemHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.systemStringHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should accumulate system strings from multiple hook calls', () => {
      const hook1 = {
        systemStringHook: jest.fn(() => ({
          'en-US': {
            TaskHeaderLine: 'Task Info',
          },
        })),
      };

      const hook2 = {
        systemStringHook: jest.fn(() => ({
          'en-US': {
            AgentStatusLine: 'Status Info',
          },
        })),
      };

      Strings.addSystemHook(Flex, mockManager, 'feature-1', hook1);
      Strings.addSystemHook(Flex, mockManager, 'feature-2', hook2);

      expect(hook1.systemStringHook).toHaveBeenCalled();
      expect(hook2.systemStringHook).toHaveBeenCalled();
    });

    it('should log hook name from systemStringHook function', () => {
      const namedFunction = function mySystemStringHook() {
        return {
          'en-US': { Test: 'Value' },
        };
      };

      const hook = {
        systemStringHook: namedFunction,
      };

      Strings.addSystemHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('mySystemStringHook'), expect.any(String));
    });
  });

  describe('init', () => {
    beforeEach(() => {
      // Reset module state before each test in this describe block
      resetState();
    });

    it('should merge custom and system strings into manager.strings', () => {
      // Add some custom strings
      const customHook = {
        stringHook: jest.fn(() => ({
          'en-US': {
            CustomString: 'Custom Value',
          },
        })),
      };

      // Add some system strings
      const systemHook = {
        systemStringHook: jest.fn(() => ({
          'en-US': {
            TaskHeaderLine: 'Modified Task Header',
          },
        })),
      };

      Strings.addHook(Flex, mockManager, 'custom-feature', customHook);
      Strings.addSystemHook(Flex, mockManager, 'system-feature', systemHook);

      // Call init to merge strings
      Strings.init(mockManager);

      // Manager strings should now include custom strings, original strings, and system overrides
      expect(mockManager.strings).toHaveProperty('CustomString');
      expect(mockManager.strings).toHaveProperty('TaskHeaderLine');
      expect(mockManager.strings).toHaveProperty('existingString');
    });

    it('should preserve existing manager strings', () => {
      Strings.init(mockManager);

      expect(mockManager.strings).toHaveProperty('existingString', 'Existing Value');
    });

    it('should allow system strings to override default strings', () => {
      mockManager.strings = {
        TaskHeaderLine: 'Original Header',
      } as any;

      const systemHook = {
        systemStringHook: jest.fn(() => ({
          'en-US': {
            TaskHeaderLine: 'Overridden Header',
          },
        })),
      };

      Strings.addSystemHook(Flex, mockManager, 'override-feature', systemHook);
      Strings.init(mockManager);

      // System strings come after manager.strings, so they should override
      expect(mockManager.strings.TaskHeaderLine).toBe('Overridden Header');
    });
  });
});
