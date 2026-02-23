import * as Flex from '@twilio/flex-ui';

import * as Components from './components';
import { resetState } from './components';

// Mock Flex with Manager
jest.mock('@twilio/flex-ui', () => ({
  Manager: {
    getInstance: jest.fn(() => ({})),
  },
}));

// Get reference to mocked manager
const mockManager = Flex.Manager.getInstance() as Flex.Manager;

describe('utils/feature-loader/components', () => {
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
    it('should store hook without executing it', () => {
      const hook = {
        componentName: 'TestComponent',
        componentHook: jest.fn(),
      };

      Components.addHook(Flex, mockManager, 'test-feature', hook);

      // Hook should NOT be called during addHook
      expect(hook.componentHook).not.toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/test-feature registered/),
        expect.any(String),
        expect.any(String),
        expect.any(String),
      );
    });

    it('should accumulate multiple hooks', () => {
      const hook1 = {
        componentName: 'Component1',
        componentHook: jest.fn(),
      };

      const hook2 = {
        componentName: 'Component2',
        componentHook: jest.fn(),
      };

      Components.addHook(Flex, mockManager, 'feature-1', hook1);
      Components.addHook(Flex, mockManager, 'feature-2', hook2);

      // Neither hook should be called yet
      expect(hook1.componentHook).not.toHaveBeenCalled();
      expect(hook2.componentHook).not.toHaveBeenCalled();
    });

    it('should log component name and hook name', () => {
      const namedFunction = function myComponentHook() {
        // noop
      };

      const hook = {
        componentName: 'MyCustomComponent',
        componentHook: namedFunction,
      };

      Components.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/MyCustomComponent/),
        expect.any(String),
        expect.any(String),
        expect.any(String),
      );
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/myComponentHook/),
        expect.any(String),
        expect.any(String),
        expect.any(String),
      );
    });

    it('should handle hooks with same component name from different features', () => {
      const hook1 = {
        componentName: 'SharedComponent',
        componentHook: jest.fn(),
      };

      const hook2 = {
        componentName: 'SharedComponent',
        componentHook: jest.fn(),
      };

      Components.addHook(Flex, mockManager, 'feature-1', hook1);
      Components.addHook(Flex, mockManager, 'feature-2', hook2);

      // Both hooks should be stored
      expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('init', () => {
    it('should execute all accumulated hooks', () => {
      const hook1 = {
        componentName: 'Component1',
        componentHook: jest.fn(),
      };

      const hook2 = {
        componentName: 'Component2',
        componentHook: jest.fn(),
      };

      Components.addHook(Flex, mockManager, 'feature-1', hook1);
      Components.addHook(Flex, mockManager, 'feature-2', hook2);

      // Call init
      Components.init(Flex, mockManager);

      // Both hooks should now be called
      expect(hook1.componentHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(hook2.componentHook).toHaveBeenCalledWith(Flex, mockManager);
    });

    it('should execute hooks in order they were added', () => {
      const callOrder: string[] = [];

      const hook1 = {
        componentName: 'Component1',
        componentHook: jest.fn(() => {
          callOrder.push('hook1');
        }),
      };

      const hook2 = {
        componentName: 'Component2',
        componentHook: jest.fn(() => {
          callOrder.push('hook2');
        }),
      };

      const hook3 = {
        componentName: 'Component3',
        componentHook: jest.fn(() => {
          callOrder.push('hook3');
        }),
      };

      Components.addHook(Flex, mockManager, 'feature-1', hook1);
      Components.addHook(Flex, mockManager, 'feature-2', hook2);
      Components.addHook(Flex, mockManager, 'feature-3', hook3);

      Components.init(Flex, mockManager);

      expect(callOrder).toEqual(['hook1', 'hook2', 'hook3']);
    });

    it('should work with no hooks registered', () => {
      // Should not throw
      expect(() => {
        Components.init(Flex, mockManager);
      }).not.toThrow();
    });

    it('should pass correct arguments to each hook', () => {
      const hook = {
        componentName: 'TestComponent',
        componentHook: jest.fn(),
      };

      Components.addHook(Flex, mockManager, 'test-feature', hook);
      Components.init(Flex, mockManager);

      expect(hook.componentHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(hook.componentHook).toHaveBeenCalledTimes(1);
    });
  });
});
