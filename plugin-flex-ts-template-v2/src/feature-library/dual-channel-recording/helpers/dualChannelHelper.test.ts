import { ITask } from '@twilio/flex-ui';

import { canRecordTask } from './dualChannelHelper';
import * as config from '../config';

jest.mock('../config');

const mockGetExcludedQueues = config.getExcludedQueues as jest.MockedFunction<typeof config.getExcludedQueues>;
const mockGetExcludedAttributes = config.getExcludedAttributes as jest.MockedFunction<
  typeof config.getExcludedAttributes
>;

describe('dual-channel-recording/canRecordTask', () => {
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
    mockGetExcludedQueues.mockReturnValue(['Excluded Queue', 'Another Queue']);
    mockGetExcludedAttributes.mockReturnValue([]);

    const task = {
      queueName: 'Excluded Queue',
      queueSid: 'WQ123',
      attributes: {},
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(false);
  });

  it('should return false when task queue SID matches exclusion list', () => {
    mockGetExcludedQueues.mockReturnValue(['WQ456']);
    mockGetExcludedAttributes.mockReturnValue([]);

    const task = {
      queueName: 'Some Queue',
      queueSid: 'WQ456',
      attributes: {},
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(false);
  });

  it('should check queue exclusions before attribute exclusions', () => {
    mockGetExcludedQueues.mockReturnValue(['Excluded Queue']);
    mockGetExcludedAttributes.mockReturnValue([{ key: 'direction', value: 'outbound' }]);

    const task = {
      queueName: 'Excluded Queue',
      queueSid: 'WQ123',
      attributes: { direction: 'inbound' }, // Does not match attribute exclusion
    } as unknown as ITask;

    // Should still exclude due to queue match
    expect(canRecordTask(task)).toBe(false);
  });

  it('should return false when any attribute exclusion matches', () => {
    mockGetExcludedQueues.mockReturnValue([]);
    mockGetExcludedAttributes.mockReturnValue([
      { key: 'direction', value: 'outbound' },
      { key: 'customer.vip', value: 'true' },
    ]);

    const task = {
      queueName: 'Test Queue',
      queueSid: 'WQ123',
      attributes: { direction: 'inbound', customer: { vip: 'true' } },
    } as unknown as ITask;

    // Should exclude because customer.vip matches
    expect(canRecordTask(task)).toBe(false);
  });

  it('should return true when task has no matching exclusions', () => {
    mockGetExcludedQueues.mockReturnValue(['Other Queue']);
    mockGetExcludedAttributes.mockReturnValue([
      { key: 'direction', value: 'outbound' },
      { key: 'tags', value: 'do-not-record' },
    ]);

    const task = {
      queueName: 'Test Queue',
      queueSid: 'WQ123',
      attributes: {
        direction: 'inbound',
        tags: ['urgent', 'escalated'],
      },
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(true);
  });

  it('should properly integrate with matchesAttribute for complex attributes', () => {
    mockGetExcludedQueues.mockReturnValue([]);
    mockGetExcludedAttributes.mockReturnValue([{ key: 'customer.preferences.privacy', value: 'no-recording' }]);

    // Test that nested array attribute matching works through integration
    const task = {
      queueName: 'Test Queue',
      queueSid: 'WQ123',
      attributes: {
        customer: {
          preferences: {
            privacy: ['anonymous', 'no-recording'],
          },
        },
      },
    } as unknown as ITask;

    expect(canRecordTask(task)).toBe(false);
  });
});
