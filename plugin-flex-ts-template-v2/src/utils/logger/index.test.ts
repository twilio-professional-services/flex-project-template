import Logger from '.';
import Destination from './destination';

describe('utils/logger', () => {
  let mockDestination: jest.Mocked<Destination>;

  beforeEach(() => {
    // Create a mock destination
    mockDestination = {
      log: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Clear destinations and buffer before each test
    Logger.destinations = [];
    Logger.buffer = [];
    Logger.meta = {};
  });

  describe('addDestination', () => {
    it('should add a destination', () => {
      Logger.addDestination(mockDestination);
      expect(Logger.destinations).toHaveLength(1);
      expect(Logger.destinations[0]).toBe(mockDestination);
    });

    it('should add multiple destinations', () => {
      const mockDestination2 = { log: jest.fn().mockResolvedValue(undefined) } as any;
      Logger.addDestination(mockDestination);
      Logger.addDestination(mockDestination2);
      expect(Logger.destinations).toHaveLength(2);
    });
  });

  describe('addMetaData', () => {
    it('should add metadata', () => {
      Logger.addMetaData('environment', 'test');
      expect(Logger.meta.environment).toBe('test');
    });

    it('should add multiple metadata entries', () => {
      Logger.addMetaData('environment', 'test');
      Logger.addMetaData('version', '1.0.0');
      expect(Logger.meta).toEqual({
        environment: 'test',
        version: '1.0.0',
      });
    });
  });

  describe('buffering behavior', () => {
    it('should buffer messages when no destinations are configured', async () => {
      await Logger.info('Test message');
      await Logger.warn('Warning message');

      expect(Logger.buffer).toHaveLength(2);
      expect(Logger.buffer[0]).toEqual({
        level: 'info',
        message: 'Test message',
        context: undefined,
      });
      expect(Logger.buffer[1]).toEqual({
        level: 'warn',
        message: 'Warning message',
        context: undefined,
      });
    });

    it('should buffer messages with context', async () => {
      const context = { userId: '123', action: 'test' };
      await Logger.error('Error occurred', context);

      expect(Logger.buffer).toHaveLength(1);
      expect(Logger.buffer[0]).toEqual({
        level: 'error',
        message: 'Error occurred',
        context,
      });
    });

    it('should not send messages to destinations when buffering', async () => {
      await Logger.info('Test message');
      expect(mockDestination.log).not.toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    beforeEach(() => {
      Logger.addDestination(mockDestination);
    });

    it('should log info messages', async () => {
      await Logger.info('Info message');
      expect(mockDestination.log).toHaveBeenCalledWith('info', 'Info message', undefined, {});
    });

    it('should log debug messages', async () => {
      await Logger.debug('Debug message');
      expect(mockDestination.log).toHaveBeenCalledWith('debug', 'Debug message', undefined, {});
    });

    it('should log warn messages', async () => {
      await Logger.warn('Warning message');
      expect(mockDestination.log).toHaveBeenCalledWith('warn', 'Warning message', undefined, {});
    });

    it('should log error messages', async () => {
      await Logger.error('Error message');
      expect(mockDestination.log).toHaveBeenCalledWith('error', 'Error message', undefined, {});
    });

    it('should log generic log messages', async () => {
      await Logger.log('Log message');
      expect(mockDestination.log).toHaveBeenCalledWith('log', 'Log message', undefined, {});
    });

    it('should pass context to destination', async () => {
      const context = { taskSid: 'WT123', error: 'timeout' };
      await Logger.error('Task failed', context);
      expect(mockDestination.log).toHaveBeenCalledWith('error', 'Task failed', context, {});
    });

    it('should pass metadata to destination', async () => {
      Logger.addMetaData('workerSid', 'WK123');
      await Logger.info('Task accepted');
      expect(mockDestination.log).toHaveBeenCalledWith('info', 'Task accepted', undefined, { workerSid: 'WK123' });
    });
  });

  describe('multiple destinations', () => {
    it('should send messages to all destinations', async () => {
      const mockDestination2 = { log: jest.fn().mockResolvedValue(undefined) } as any;
      Logger.addDestination(mockDestination);
      Logger.addDestination(mockDestination2);

      await Logger.info('Test message');

      expect(mockDestination.log).toHaveBeenCalledWith('info', 'Test message', undefined, {});
      expect(mockDestination2.log).toHaveBeenCalledWith('info', 'Test message', undefined, {});
    });

    it('should send messages to destinations in order', async () => {
      const callOrder: number[] = [];
      const dest1 = {
        log: jest.fn().mockImplementation(async () => {
          callOrder.push(1);
        }),
      } as any;
      const dest2 = {
        log: jest.fn().mockImplementation(async () => {
          callOrder.push(2);
        }),
      } as any;

      Logger.addDestination(dest1);
      Logger.addDestination(dest2);

      await Logger.info('Test message');

      expect(callOrder).toEqual([1, 2]);
    });
  });

  describe('processBuffer', () => {
    it('should process buffered messages when destinations are added', async () => {
      // Buffer messages first
      await Logger.info('Message 1');
      await Logger.warn('Message 2');
      expect(Logger.buffer).toHaveLength(2);

      // Add destination and process buffer
      Logger.addDestination(mockDestination);
      await Logger.processBuffer();

      expect(mockDestination.log).toHaveBeenCalledTimes(2);
      expect(mockDestination.log).toHaveBeenNthCalledWith(1, 'info', 'Message 1', undefined, {});
      expect(mockDestination.log).toHaveBeenNthCalledWith(2, 'warn', 'Message 2', undefined, {});
      expect(Logger.buffer).toHaveLength(0);
    });

    it('should clear buffer when no destinations configured', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await Logger.info('Message 1');
      expect(Logger.buffer).toHaveLength(1);

      await Logger.processBuffer();

      expect(Logger.buffer).toHaveLength(0);
      expect(consoleWarnSpy).toHaveBeenCalledWith('No destinations configured, erasing log message buffer');

      consoleWarnSpy.mockRestore();
    });

    it('should include metadata when processing buffer', async () => {
      Logger.addMetaData('sessionId', 'abc123');

      await Logger.info('Buffered message');
      Logger.addDestination(mockDestination);
      await Logger.processBuffer();

      expect(mockDestination.log).toHaveBeenCalledWith('info', 'Buffered message', undefined, { sessionId: 'abc123' });
    });

    it('should preserve context when processing buffer', async () => {
      const context = { taskId: 'T123' };
      await Logger.error('Error occurred', context);

      Logger.addDestination(mockDestination);
      await Logger.processBuffer();

      expect(mockDestination.log).toHaveBeenCalledWith('error', 'Error occurred', context, {});
    });
  });

  describe('async behavior', () => {
    it('should wait for destination log to complete', async () => {
      let logCompleted = false;
      const slowDestination = {
        log: jest.fn().mockImplementation(async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          logCompleted = true;
        }),
      } as any;

      Logger.addDestination(slowDestination);
      await Logger.info('Test message');

      expect(logCompleted).toBe(true);
    });

    it('should process all destinations before resolving', async () => {
      const completionOrder: number[] = [];
      const dest1 = {
        log: jest.fn().mockImplementation(async () => {
          await new Promise((resolve) => setTimeout(resolve, 20));
          completionOrder.push(1);
        }),
      } as any;
      const dest2 = {
        log: jest.fn().mockImplementation(async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          completionOrder.push(2);
        }),
      } as any;

      Logger.addDestination(dest1);
      Logger.addDestination(dest2);
      await Logger.info('Test');

      // Destinations process sequentially, so order should be 1, 2
      expect(completionOrder).toEqual([1, 2]);
    });
  });
});
