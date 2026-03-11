import TaskRouterService from './TaskRouterService';

// Mock Flex Manager (hoisted automatically by Jest)
jest.mock('@twilio/flex-ui', () => ({
  Manager: {
    getInstance: jest.fn(() => ({
      serviceConfiguration: {
        flex_service_instance_sid: 'test-instance-123',
      },
      user: {
        token: 'test-token',
      },
      configuration: {
        custom_data: {
          serverless_functions_protocol: 'https',
          serverless_functions_domain: 'test-domain.twil.io',
          features: {},
        },
      },
    })),
  },
  TaskHelper: {
    isLiveCall: jest.fn(),
    getTaskByTaskSid: jest.fn((taskSid: string) => {
      // Return a truthy value for all task sids by default
      // Tests can override this if needed
      return { taskSid };
    }),
  },
}));

// Mock configuration module to avoid module-level execution issues
jest.mock('../../configuration', () => ({
  getFeatureFlags: jest.fn(() => ({
    serverless_functions_protocol: 'https',
    serverless_functions_domain: 'test-domain.twil.io',
  })),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('utils/serverless/TaskRouter/TaskRouterService', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('addToLocalStorage', () => {
    it('should add new task attributes to localStorage', () => {
      const taskSid = 'WT123';
      const attributes = { status: 'pending', priority: 'high' };

      TaskRouterService.addToLocalStorage(taskSid, attributes);

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT123: { status: 'pending', priority: 'high' },
      });
    });

    it('should merge attributes for existing task', () => {
      const taskSid = 'WT123';

      TaskRouterService.addToLocalStorage(taskSid, { status: 'pending' });
      TaskRouterService.addToLocalStorage(taskSid, { priority: 'high' });

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT123: { status: 'pending', priority: 'high' },
      });
    });

    it('should handle multiple tasks', () => {
      TaskRouterService.addToLocalStorage('WT123', { status: 'pending' });
      TaskRouterService.addToLocalStorage('WT456', { status: 'active' });
      TaskRouterService.addToLocalStorage('WT789', { status: 'completed' });

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT123: { status: 'pending' },
        WT456: { status: 'active' },
        WT789: { status: 'completed' },
      });
    });

    it('should deeply merge nested attributes', () => {
      const taskSid = 'WT123';

      TaskRouterService.addToLocalStorage(taskSid, {
        conversations: { outcome: 'resolved' },
      });
      TaskRouterService.addToLocalStorage(taskSid, {
        conversations: { notes: 'Customer satisfied' },
      });

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT123: {
          conversations: {
            outcome: 'resolved',
            notes: 'Customer satisfied',
          },
        },
      });
    });

    it('should overwrite existing values with same key', () => {
      const taskSid = 'WT123';

      TaskRouterService.addToLocalStorage(taskSid, { status: 'pending' });
      TaskRouterService.addToLocalStorage(taskSid, { status: 'completed' });

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT123: { status: 'completed' },
      });
    });

    it('should handle empty attributes object', () => {
      const taskSid = 'WT123';

      TaskRouterService.addToLocalStorage(taskSid, {});

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT123: {},
      });
    });
  });

  describe('fetchFromLocalStorage', () => {
    it('should fetch existing task attributes', () => {
      const taskSid = 'WT123';
      TaskRouterService.addToLocalStorage(taskSid, { status: 'pending', priority: 'high' });

      const result = TaskRouterService.fetchFromLocalStorage(taskSid);

      expect(result).toEqual({ status: 'pending', priority: 'high' });
    });

    it('should return empty object for non-existent task', () => {
      const result = TaskRouterService.fetchFromLocalStorage('WT999');

      expect(result).toEqual({});
    });

    it('should return empty object when localStorage is empty', () => {
      localStorageMock.clear();

      const result = TaskRouterService.fetchFromLocalStorage('WT123');

      expect(result).toEqual({});
    });

    it('should fetch correct task when multiple tasks exist', () => {
      TaskRouterService.addToLocalStorage('WT123', { status: 'pending' });
      TaskRouterService.addToLocalStorage('WT456', { status: 'active' });

      const result = TaskRouterService.fetchFromLocalStorage('WT456');

      expect(result).toEqual({ status: 'active' });
    });

    it('should fetch nested attributes correctly', () => {
      const taskSid = 'WT123';
      const attributes = {
        conversations: {
          outcome: 'resolved',
          notes: 'Test notes',
        },
      };
      TaskRouterService.addToLocalStorage(taskSid, attributes);

      const result = TaskRouterService.fetchFromLocalStorage(taskSid);

      expect(result).toEqual(attributes);
    });
  });

  describe('removeFromLocalStorage', () => {
    it('should remove specific task from localStorage', () => {
      TaskRouterService.addToLocalStorage('WT123', { status: 'pending' });
      TaskRouterService.addToLocalStorage('WT456', { status: 'active' });

      TaskRouterService.removeFromLocalStorage('WT123');

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT456: { status: 'active' },
      });
    });

    it('should handle removing non-existent task', () => {
      TaskRouterService.addToLocalStorage('WT123', { status: 'pending' });

      TaskRouterService.removeFromLocalStorage('WT999');

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT123: { status: 'pending' },
      });
    });

    it('should handle removing from empty localStorage', () => {
      TaskRouterService.removeFromLocalStorage('WT123');

      const stored = localStorage.getItem('pending_task_updates_test-instance-123');
      expect(stored).toBeNull();
    });

    it('should remove last task and leave empty object', () => {
      TaskRouterService.addToLocalStorage('WT123', { status: 'pending' });

      TaskRouterService.removeFromLocalStorage('WT123');

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({});
    });

    it('should handle multiple removals', () => {
      TaskRouterService.addToLocalStorage('WT123', { status: 'pending' });
      TaskRouterService.addToLocalStorage('WT456', { status: 'active' });
      TaskRouterService.addToLocalStorage('WT789', { status: 'completed' });

      TaskRouterService.removeFromLocalStorage('WT123');
      TaskRouterService.removeFromLocalStorage('WT789');

      const stored = JSON.parse(localStorage.getItem('pending_task_updates_test-instance-123')!);
      expect(stored).toEqual({
        WT456: { status: 'active' },
      });
    });
  });

  describe('localStorage integration', () => {
    it('should handle add, fetch, and remove workflow', () => {
      const taskSid = 'WT123';
      const attributes = { status: 'pending', priority: 'high' };

      // Add
      TaskRouterService.addToLocalStorage(taskSid, attributes);

      // Fetch
      let result = TaskRouterService.fetchFromLocalStorage(taskSid);
      expect(result).toEqual(attributes);

      // Remove
      TaskRouterService.removeFromLocalStorage(taskSid);

      // Fetch after remove
      result = TaskRouterService.fetchFromLocalStorage(taskSid);
      expect(result).toEqual({});
    });

    it('should maintain data consistency across operations', () => {
      // Add multiple tasks
      TaskRouterService.addToLocalStorage('WT1', { status: 'pending' });
      TaskRouterService.addToLocalStorage('WT2', { status: 'active' });
      TaskRouterService.addToLocalStorage('WT3', { status: 'completed' });

      // Update one task
      TaskRouterService.addToLocalStorage('WT2', { priority: 'high' });

      // Remove one task
      TaskRouterService.removeFromLocalStorage('WT1');

      // Verify final state
      expect(TaskRouterService.fetchFromLocalStorage('WT1')).toEqual({});
      expect(TaskRouterService.fetchFromLocalStorage('WT2')).toEqual({
        status: 'active',
        priority: 'high',
      });
      expect(TaskRouterService.fetchFromLocalStorage('WT3')).toEqual({ status: 'completed' });
    });
  });
});
