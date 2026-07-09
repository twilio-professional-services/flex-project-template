import * as Flex from '@twilio/flex-ui';

import * as CssOverrides from './css-overrides';
import { resetState } from './css-overrides';

// Mock Flex with Manager
jest.mock('@twilio/flex-ui', () => ({
  Manager: {
    getInstance: jest.fn(() => ({
      updateConfig: jest.fn(),
    })),
  },
}));

// Get reference to mocked manager
const mockManager = Flex.Manager.getInstance() as Flex.Manager;

describe('utils/feature-loader/css-overrides', () => {
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    resetState();

    // Spy on console
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
  });

  describe('addHook', () => {
    it('should add CSS overrides from hook', () => {
      const hook = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              background: 'red',
            },
          },
        })),
      };

      CssOverrides.addHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.cssOverrideHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/test-feature registered CSS override hook/),
        expect.any(String),
      );
    });

    it('should merge multiple CSS overrides', () => {
      const hook1 = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              background: 'red',
            },
          },
        })),
      };

      const hook2 = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              color: 'white',
            },
          },
        })),
      };

      CssOverrides.addHook(Flex, mockManager, 'feature-1', hook1);
      CssOverrides.addHook(Flex, mockManager, 'feature-2', hook2);

      expect(hook1.cssOverrideHook).toHaveBeenCalled();
      expect(hook2.cssOverrideHook).toHaveBeenCalled();
    });

    it('should deeply merge nested overrides', () => {
      const hook1 = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              background: 'red',
              padding: '10px',
            },
          },
        })),
      };

      const hook2 = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              color: 'white',
            },
            Logo: {
              display: 'none',
            },
          },
        })),
      };

      CssOverrides.addHook(Flex, mockManager, 'feature-1', hook1);
      CssOverrides.addHook(Flex, mockManager, 'feature-2', hook2);

      // Both hooks should be called
      expect(hook1.cssOverrideHook).toHaveBeenCalled();
      expect(hook2.cssOverrideHook).toHaveBeenCalled();
    });

    it('should handle later overrides replacing earlier values', () => {
      const hook1 = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              background: 'red',
            },
          },
        })),
      };

      const hook2 = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              background: 'blue', // Should override red
            },
          },
        })),
      };

      CssOverrides.addHook(Flex, mockManager, 'feature-1', hook1);
      CssOverrides.addHook(Flex, mockManager, 'feature-2', hook2);

      expect(hook1.cssOverrideHook).toHaveBeenCalled();
      expect(hook2.cssOverrideHook).toHaveBeenCalled();
    });

    it('should handle empty overrides', () => {
      const hook = {
        cssOverrideHook: jest.fn(() => ({})),
      };

      CssOverrides.addHook(Flex, mockManager, 'empty-feature', hook);

      expect(hook.cssOverrideHook).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should log hook name', () => {
      const namedFunction = function myCssOverrideHook() {
        return {
          MainHeader: { Container: { background: 'red' } },
        };
      };

      const hook = {
        cssOverrideHook: namedFunction,
      };

      CssOverrides.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/myCssOverrideHook/), expect.any(String));
    });
  });

  describe('init', () => {
    it('should call updateConfig with theme overrides', () => {
      const hook = {
        cssOverrideHook: jest.fn(() => ({
          MainHeader: {
            Container: {
              background: 'red',
            },
          },
        })),
      };

      CssOverrides.addHook(Flex, mockManager, 'test-feature', hook);
      CssOverrides.init(mockManager);

      expect(mockManager.updateConfig).toHaveBeenCalledWith({
        theme: {
          componentThemeOverrides: expect.any(Object),
        },
      });
    });

    it('should work with empty overrides', () => {
      CssOverrides.init(mockManager);

      expect(mockManager.updateConfig).toHaveBeenCalledWith({
        theme: {
          componentThemeOverrides: {},
        },
      });
    });

    it('should merge all accumulated overrides before init', () => {
      const hook1 = {
        cssOverrideHook: jest.fn(() => ({
          Component1: { style: 'value1' },
        })),
      };

      const hook2 = {
        cssOverrideHook: jest.fn(() => ({
          Component2: { style: 'value2' },
        })),
      };

      CssOverrides.addHook(Flex, mockManager, 'feature-1', hook1);
      CssOverrides.addHook(Flex, mockManager, 'feature-2', hook2);
      CssOverrides.init(mockManager);

      expect(mockManager.updateConfig).toHaveBeenCalledWith({
        theme: {
          componentThemeOverrides: expect.objectContaining({
            Component1: expect.anything(),
            Component2: expect.anything(),
          }),
        },
      });
    });
  });
});
