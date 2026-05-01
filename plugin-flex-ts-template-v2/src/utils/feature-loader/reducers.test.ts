import * as Flex from '@twilio/flex-ui';
import { combineReducers } from 'redux';

import * as Reducers from './reducers';
import { resetState } from './reducers';

// Mock Flex with Manager and VERSION
jest.mock('@twilio/flex-ui', () => ({
  VERSION: '2.0.0',
  Manager: {
    getInstance: jest.fn(() => ({
      store: {
        addReducer: jest.fn(),
      },
    })),
  },
}));

// Mock redux
jest.mock('redux', () => ({
  combineReducers: jest.fn((reducers) => reducers),
}));

// Mock state module
jest.mock('../state', () => ({
  reduxNamespace: 'custom',
}));

// Get reference to mocked manager
const mockManager = Flex.Manager.getInstance() as Flex.Manager;

describe('utils/feature-loader/reducers', () => {
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
    it('should add reducer from hook', () => {
      const mockReducer = jest.fn();
      const hook = {
        reducerHook: jest.fn(() => ({
          myFeature: mockReducer,
        })),
      };

      Reducers.addHook(Flex, mockManager, 'test-feature', hook);

      expect(hook.reducerHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/test-feature registered reducer hook/),
        expect.any(String),
      );
    });

    it('should accumulate multiple reducers', () => {
      const reducer1 = jest.fn();
      const reducer2 = jest.fn();

      const hook1 = {
        reducerHook: jest.fn(() => ({
          feature1: reducer1,
        })),
      };

      const hook2 = {
        reducerHook: jest.fn(() => ({
          feature2: reducer2,
        })),
      };

      Reducers.addHook(Flex, mockManager, 'feature-1', hook1);
      Reducers.addHook(Flex, mockManager, 'feature-2', hook2);

      expect(hook1.reducerHook).toHaveBeenCalled();
      expect(hook2.reducerHook).toHaveBeenCalled();
    });

    it('should merge multiple reducers from same feature', () => {
      const reducer1 = jest.fn();
      const reducer2 = jest.fn();

      const hook = {
        reducerHook: jest.fn(() => ({
          reducer1,
          reducer2,
        })),
      };

      Reducers.addHook(Flex, mockManager, 'multi-reducer-feature', hook);

      expect(hook.reducerHook).toHaveBeenCalledWith(Flex, mockManager);
    });

    it('should log hook name', () => {
      const namedFunction = function myReducerHook() {
        return { test: jest.fn() };
      };

      const hook = {
        reducerHook: namedFunction,
      };

      Reducers.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/myReducerHook/), expect.any(String));
    });
  });

  describe('init', () => {
    it('should call combineReducers and addReducer when manager supports it', () => {
      const mockReducer = jest.fn();
      const hook = {
        reducerHook: jest.fn(() => ({
          testReducer: mockReducer,
        })),
      };

      Reducers.addHook(Flex, mockManager, 'test-feature', hook);
      Reducers.init(mockManager);

      expect(combineReducers).toHaveBeenCalled();
      expect(mockManager.store.addReducer).toHaveBeenCalledWith('custom', expect.anything());
    });

    it('should log error when manager does not support addReducer', () => {
      const mockManagerNoReducer = {
        store: {},
      } as unknown as Flex.Manager;

      Reducers.init(mockManagerNoReducer);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/You need FlexUI > 1\.9\.0 to use built-in redux; you are currently on .+/),
      );
      expect(combineReducers).not.toHaveBeenCalled();
    });

    it('should not call addReducer when manager does not support it', () => {
      const mockManagerNoReducer = {
        store: {},
      } as unknown as Flex.Manager;

      Reducers.init(mockManagerNoReducer);

      expect(combineReducers).not.toHaveBeenCalled();
    });

    it('should work with empty reducers', () => {
      Reducers.init(mockManager);

      expect(combineReducers).toHaveBeenCalled();
      expect(mockManager.store.addReducer).toHaveBeenCalledWith('custom', expect.anything());
    });
  });
});
