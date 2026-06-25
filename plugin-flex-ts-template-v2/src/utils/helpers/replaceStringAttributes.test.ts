import { ITask, Manager } from '@twilio/flex-ui';

import replaceStringAttributes from './replaceStringAttributes';

// Mock the Manager getInstance
jest.mock('@twilio/flex-ui', () => ({
  Manager: {
    getInstance: jest.fn(),
  },
}));

// Mock the ApiService
jest.mock('../serverless/ApiService', () => {
  return jest.fn().mockImplementation(() => ({
    serverlessProtocol: 'https',
    serverlessDomain: 'test-domain.twil.io',
  }));
});

describe('utils/helpers/replaceStringAttributes', () => {
  const mockManagerInstance = {
    workerClient: {
      attributes: {
        full_name: 'John Doe',
        email: 'john@example.com',
        contact_uri: 'client:john',
        skills: ['spanish', 'sales'],
        team: {
          name: 'Sales Team',
          id: 'T123',
        },
      },
    },
  };

  beforeEach(() => {
    (Manager.getInstance as jest.Mock).mockReturnValue(mockManagerInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('task attribute replacement', () => {
    it('should replace simple task attribute', () => {
      const task = {
        attributes: {
          name: 'Alice',
          from: '+15551234567',
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('Customer: {{task.name}}', task);
      expect(result).toBe('Customer: Alice');
    });

    it('should replace multiple task attributes', () => {
      const task = {
        attributes: {
          name: 'Alice',
          from: '+15551234567',
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('{{task.name}} called from {{task.from}}', task);
      expect(result).toBe('Alice called from +15551234567');
    });

    it('should replace nested task attributes', () => {
      const task = {
        attributes: {
          customer: {
            profile: {
              name: 'Bob Smith',
              tier: 'premium',
            },
          },
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('Welcome {{task.customer.profile.name}}', task);
      expect(result).toBe('Welcome Bob Smith');
    });

    it('should return empty string for non-existent task attributes', () => {
      const task = {
        attributes: {
          name: 'Alice',
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('Age: {{task.age}}', task);
      expect(result).toBe('Age: ');
    });

    it('should return empty string for non-existent nested task attributes', () => {
      const task = {
        attributes: {
          customer: {
            name: 'Alice',
          },
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('Tier: {{task.customer.profile.tier}}', task);
      expect(result).toBe('Tier: ');
    });

    it('should handle task attribute when task is not provided', () => {
      const result = replaceStringAttributes('Customer: {{task.name}}');
      expect(result).toBe('Customer: {{task.name}}');
    });
  });

  describe('worker attribute replacement', () => {
    it('should replace simple worker attribute', () => {
      const result = replaceStringAttributes('Agent: {{worker.full_name}}');
      expect(result).toBe('Agent: John Doe');
    });

    it('should replace multiple worker attributes', () => {
      const result = replaceStringAttributes('{{worker.full_name}} - {{worker.email}}');
      expect(result).toBe('John Doe - john@example.com');
    });

    it('should replace nested worker attributes', () => {
      const result = replaceStringAttributes('Team: {{worker.team.name}}');
      expect(result).toBe('Team: Sales Team');
    });

    it('should return empty string for non-existent worker attributes', () => {
      const result = replaceStringAttributes('Phone: {{worker.phone}}');
      expect(result).toBe('Phone: ');
    });
  });

  describe('serverless URL replacement', () => {
    it('should replace serverless URL', () => {
      const result = replaceStringAttributes('URL: {{serverless.url}}');
      expect(result).toBe('URL: https://test-domain.twil.io');
    });

    it('should replace multiple serverless references', () => {
      const result = replaceStringAttributes('{{serverless.url}}/api and {{serverless.url}}/status');
      expect(result).toBe('https://test-domain.twil.io/api and https://test-domain.twil.io/status');
    });
  });

  describe('mixed replacements', () => {
    it('should handle task, worker, and serverless replacements together', () => {
      const task = {
        attributes: {
          case_id: 'CASE-123',
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('{{serverless.url}}/cases/{{task.case_id}}?agent={{worker.email}}', task);
      expect(result).toBe('https://test-domain.twil.io/cases/CASE-123?agent=john@example.com');
    });

    it('should handle mixed valid and invalid attributes', () => {
      const task = {
        attributes: {
          name: 'Alice',
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('{{task.name}} - {{task.missing}} - {{worker.full_name}}', task);
      expect(result).toBe('Alice -  - John Doe');
    });
  });

  describe('edge cases', () => {
    it('should return original string if no templates found', () => {
      const result = replaceStringAttributes('No templates here');
      expect(result).toBe('No templates here');
    });

    it('should handle empty string', () => {
      const result = replaceStringAttributes('');
      expect(result).toBe('');
    });

    it('should handle strings with curly braces but invalid template syntax', () => {
      const result = replaceStringAttributes('Not {a} template {{or}} this {task.name}');
      expect(result).toBe('Not {a} template {{or}} this {task.name}');
    });

    it('should handle numeric values', () => {
      const task = {
        attributes: {
          priority: 5,
          count: 10,
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('Priority {{task.priority}}, Count {{task.count}}', task);
      expect(result).toBe('Priority 5, Count 10');
    });

    it('should handle boolean true values', () => {
      const task = {
        attributes: {
          vip: true,
        },
      } as unknown as ITask;

      const result = replaceStringAttributes('VIP: {{task.vip}}', task);
      expect(result).toBe('VIP: true');
    });

    it('should handle boolean false values (returns empty string due to falsy check)', () => {
      const task = {
        attributes: {
          urgent: false,
        },
      } as unknown as ITask;

      // Note: false is treated as falsy and returns empty string - this is a known behavior
      const result = replaceStringAttributes('Urgent: {{task.urgent}}', task);
      expect(result).toBe('Urgent: ');
    });

    it('should handle arrays in attributes (returns the array)', () => {
      const task = {
        attributes: {
          tags: ['urgent', 'vip'],
        },
      } as unknown as ITask;

      // Arrays are returned as-is (stringified by JavaScript)
      const result = replaceStringAttributes('Tags: {{task.tags}}', task);
      expect(result).toBe('Tags: urgent,vip');
    });

    it('should preserve template syntax for unknown attribute types', () => {
      const result = replaceStringAttributes('Unknown: {{unknown.type.attr}}');
      expect(result).toBe('Unknown: {{unknown.type.attr}}');
    });
  });
});
