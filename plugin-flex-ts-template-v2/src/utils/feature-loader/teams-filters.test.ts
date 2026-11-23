import * as Flex from '@twilio/flex-ui';

import * as TeamsFilters from './teams-filters';
import { resetState } from './teams-filters';

// Mock Flex with Manager, Actions, FilterConditions, and TeamsView
jest.mock('@twilio/flex-ui', () => ({
  Manager: {
    getInstance: jest.fn(() => ({})),
  },
  Actions: {
    invokeAction: jest.fn(),
  },
  FilterConditions: {
    IN: 'IN',
    EQ: 'EQ',
  },
  TeamsView: {
    defaultProps: {
      filters: [],
    },
  },
}));

// Get reference to mocked functions for assertions
const mockInvokeAction = Flex.Actions.invokeAction as jest.Mock;
const mockManager = Flex.Manager.getInstance() as Flex.Manager;

describe('utils/feature-loader/teams-filters', () => {
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    resetState();

    // Reset TeamsView.defaultProps.filters (using the mocked Flex from jest.mock)
    Flex.TeamsView.defaultProps.filters = [];

    // Spy on console
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
  });

  describe('addHook', () => {
    it('should store hook without executing it', () => {
      const hook = {
        teamsFilterHook: jest.fn(),
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      // Hook should NOT be called during addHook
      expect(hook.teamsFilterHook).not.toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/test-feature registered teams filter hook/),
        expect.any(String),
      );
    });

    it('should accumulate multiple hooks', () => {
      const hook1 = {
        teamsFilterHook: jest.fn(),
      };

      const hook2 = {
        teamsFilterHook: jest.fn(),
      };

      TeamsFilters.addHook(Flex, mockManager, 'feature-1', hook1);
      TeamsFilters.addHook(Flex, mockManager, 'feature-2', hook2);

      // Neither hook should be called yet
      expect(hook1.teamsFilterHook).not.toHaveBeenCalled();
      expect(hook2.teamsFilterHook).not.toHaveBeenCalled();
    });

    it('should log hook name', () => {
      const namedFunction = async function myTeamsFilterHook() {
        return Promise.resolve([]);
      };

      const hook = {
        teamsFilterHook: namedFunction,
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringMatching(/myTeamsFilterHook/), expect.any(String));
    });
  });

  describe('init', () => {
    it('should return early when no filters are registered', async () => {
      await TeamsFilters.init(Flex, mockManager);

      // Should not set filters or invoke action
      expect(Flex.TeamsView.defaultProps.filters).toEqual([]);
      expect(mockInvokeAction).not.toHaveBeenCalled();
    });

    it('should execute all accumulated hooks', async () => {
      const hook1 = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'filter1',
              title: 'Filter 1',
              options: [],
            },
          ]),
        ),
      };

      const hook2 = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'filter2',
              title: 'Filter 2',
              options: [],
            },
          ]),
        ),
      };

      TeamsFilters.addHook(Flex, mockManager, 'feature-1', hook1);
      TeamsFilters.addHook(Flex, mockManager, 'feature-2', hook2);

      await TeamsFilters.init(Flex, mockManager);

      // Both hooks should be called
      expect(hook1.teamsFilterHook).toHaveBeenCalledWith(Flex, mockManager);
      expect(hook2.teamsFilterHook).toHaveBeenCalledWith(Flex, mockManager);
    });

    it('should concatenate filters from multiple hooks', async () => {
      const hook1 = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'filter1',
              title: 'Filter 1',
              options: [],
            },
          ]),
        ),
      };

      const hook2 = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'filter2',
              title: 'Filter 2',
              options: [],
            },
          ]),
        ),
      };

      TeamsFilters.addHook(Flex, mockManager, 'feature-1', hook1);
      TeamsFilters.addHook(Flex, mockManager, 'feature-2', hook2);

      await TeamsFilters.init(Flex, mockManager);

      // Should set all filters
      expect(Flex.TeamsView.defaultProps.filters).toHaveLength(2);
      expect(Flex.TeamsView.defaultProps.filters).toContainEqual({
        id: 'filter1',
        title: 'Filter 1',
        options: [],
      });
      expect(Flex.TeamsView.defaultProps.filters).toContainEqual({
        id: 'filter2',
        title: 'Filter 2',
        options: [],
      });
    });

    it('should apply default filters when options have default: true', async () => {
      const hook = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'statusFilter',
              title: 'Status Filter',
              condition: 'IN' as Flex.FilterConditions,
              options: [
                { label: 'Available', value: 'available', default: true },
                { label: 'Busy', value: 'busy', default: false },
                { label: 'Offline', value: 'offline', default: true },
              ],
            },
          ]),
        ),
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      await TeamsFilters.init(Flex, mockManager);

      // Should invoke ApplyTeamsViewFilters with default filters
      expect(mockInvokeAction).toHaveBeenCalledWith('ApplyTeamsViewFilters', {
        filters: [
          {
            name: 'statusFilter',
            condition: 'IN',
            values: ['available', 'offline'],
          },
        ],
      });
    });

    it('should handle filters with no default options', async () => {
      const hook = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'statusFilter',
              title: 'Status Filter',
              options: [
                { label: 'Available', value: 'available', default: false },
                { label: 'Busy', value: 'busy', default: false },
              ],
            },
          ]),
        ),
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      await TeamsFilters.init(Flex, mockManager);

      // Should set filters but not invoke action (no defaults)
      expect(Flex.TeamsView.defaultProps.filters).toHaveLength(1);
      expect(mockInvokeAction).not.toHaveBeenCalled();
    });

    it('should handle multiple filters with different defaults', async () => {
      const hook = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'statusFilter',
              title: 'Status Filter',
              condition: 'IN' as Flex.FilterConditions,
              options: [
                { label: 'Available', value: 'available', default: true },
                { label: 'Busy', value: 'busy', default: false },
              ],
            },
            {
              id: 'departmentFilter',
              title: 'Department Filter',
              condition: 'EQ' as Flex.FilterConditions,
              options: [
                { label: 'Sales', value: 'sales', default: false },
                { label: 'Support', value: 'support', default: true },
              ],
            },
            {
              id: 'noDefaultFilter',
              title: 'No Default Filter',
              options: [
                { label: 'Option 1', value: 'opt1', default: false },
                { label: 'Option 2', value: 'opt2', default: false },
              ],
            },
          ]),
        ),
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      await TeamsFilters.init(Flex, mockManager);

      // Should apply filters for statusFilter and departmentFilter (both have defaults)
      expect(mockInvokeAction).toHaveBeenCalledWith('ApplyTeamsViewFilters', {
        filters: [
          {
            name: 'statusFilter',
            condition: 'IN',
            values: ['available'],
          },
          {
            name: 'departmentFilter',
            condition: 'EQ',
            values: ['support'],
          },
        ],
      });
    });

    it('should handle filters without explicit condition', async () => {
      const hook = {
        teamsFilterHook: jest.fn(async () =>
          Promise.resolve([
            {
              id: 'simpleFilter',
              title: 'Simple Filter',
              // No condition specified
              options: [{ label: 'Option', value: 'opt', default: true }],
            },
          ]),
        ),
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      await TeamsFilters.init(Flex, mockManager);

      // Should use IN as default condition
      expect(mockInvokeAction).toHaveBeenCalledWith('ApplyTeamsViewFilters', {
        filters: [
          {
            name: 'simpleFilter',
            condition: 'IN',
            values: ['opt'],
          },
        ],
      });
    });

    it('should handle hook returning empty array', async () => {
      const hook = {
        teamsFilterHook: jest.fn(async () => Promise.resolve([])),
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      await TeamsFilters.init(Flex, mockManager);

      // Should return early
      expect(Flex.TeamsView.defaultProps.filters).toEqual([]);
      expect(mockInvokeAction).not.toHaveBeenCalled();
    });

    it('should handle async hooks that take time to resolve', async () => {
      const hook = {
        teamsFilterHook: jest.fn(
          async () =>
            new Promise((resolve) => {
              setTimeout(
                () =>
                  resolve([
                    {
                      id: 'asyncFilter',
                      title: 'Async Filter',
                      options: [],
                    },
                  ]),
                10,
              );
            }),
        ),
      };

      TeamsFilters.addHook(Flex, mockManager, 'test-feature', hook);

      await TeamsFilters.init(Flex, mockManager);

      expect(hook.teamsFilterHook).toHaveBeenCalled();
      expect(Flex.TeamsView.defaultProps.filters).toHaveLength(1);
    });
  });
});
