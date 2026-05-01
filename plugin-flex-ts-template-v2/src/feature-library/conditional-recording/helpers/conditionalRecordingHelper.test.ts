import { ITask } from '@twilio/flex-ui';

import { canRecordTask } from './conditionalRecordingHelper';
import * as config from '../config';

jest.mock('../config');

const mockGetExcludedQueues = config.getExcludedQueues as jest.MockedFunction<typeof config.getExcludedQueues>;
const mockGetExcludedAttributes = config.getExcludedAttributes as jest.MockedFunction<
  typeof config.getExcludedAttributes
>;

describe('conditional-recording/canRecordTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when no exclusions are configured', () => {
    mockGetExcludedQueues.mockReturnValue([]);
    mockGetExcludedAttributes.mockReturnValue([]);

    const task = {
      queueName: 'Test Queue',
      queueSid: 'WQ123',
      attributes: { direction: 'inbound' },
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(true);
  });

  it('should return false when task queue name matches exclusion list', () => {
    mockGetExcludedQueues.mockReturnValue(['Compliance Queue', 'Legal Queue']);
    mockGetExcludedAttributes.mockReturnValue([]);

    const task = {
      queueName: 'Compliance Queue',
      queueSid: 'WQ123',
      attributes: {},
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(false);
  });

  it('should return false when task queue SID matches exclusion list', () => {
    mockGetExcludedQueues.mockReturnValue(['WQ789']);
    mockGetExcludedAttributes.mockReturnValue([]);

    const task = {
      queueName: 'Regular Queue',
      queueSid: 'WQ789',
      attributes: {},
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(false);
  });

  it('should check queue exclusions before attribute exclusions', () => {
    mockGetExcludedQueues.mockReturnValue(['Legal Queue']);
    mockGetExcludedAttributes.mockReturnValue([{ key: 'sensitive', value: 'true' }]);

    const task = {
      queueName: 'Legal Queue',
      queueSid: 'WQ123',
      attributes: { sensitive: 'false' }, // Does not match attribute exclusion
    } as unknown as ITask;

    // Should still exclude due to queue match
    expect(canRecordTask(task)).toBe(false);
  });

  it('should return false when any attribute exclusion matches', () => {
    mockGetExcludedQueues.mockReturnValue([]);
    mockGetExcludedAttributes.mockReturnValue([
      { key: 'conversations.topics', value: 'medical' },
      { key: 'conversations.topics', value: 'financial' },
    ]);

    const task = {
      queueName: 'Test Queue',
      queueSid: 'WQ123',
      attributes: {
        conversations: {
          topics: ['general', 'financial'],
        },
      },
    } as unknown as ITask;

    // Should exclude because topics array contains 'financial'
    expect(canRecordTask(task)).toBe(false);
  });

  it('should return true when task has no matching exclusions', () => {
    mockGetExcludedQueues.mockReturnValue(['Other Queue']);
    mockGetExcludedAttributes.mockReturnValue([
      { key: 'customer.consent.recording', value: 'denied' },
      { key: 'tags', value: 'do-not-record' },
    ]);

    const task = {
      queueName: 'Test Queue',
      queueSid: 'WQ123',
      attributes: {
        customer: {
          consent: {
            recording: 'granted',
          },
        },
        tags: ['normal', 'followup'],
      },
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(true);
  });

  it('should properly integrate with matchesAttribute for complex attributes', () => {
    mockGetExcludedQueues.mockReturnValue([]);
    mockGetExcludedAttributes.mockReturnValue([{ key: 'customer.flags', value: 'privacy-mode' }]);

    // Test that nested array attribute matching works through integration
    const task = {
      queueName: 'Test Queue',
      queueSid: 'WQ123',
      attributes: {
        customer: {
          flags: ['verified', 'privacy-mode', 'premium'],
        },
      },
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(false);
  });
});
