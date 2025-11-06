import Destination from './destination';

export type LogLevel = 'log' | 'debug' | 'warn' | 'info' | 'error';

type BufferedLogMessage = {
  level: LogLevel;
  message: string;
  context?: any;
};

class Logger {
  destinations: Destination[] = [];

  meta: any = {};

  buffer: BufferedLogMessage[] = [];

  addDestination(dest: Destination): void {
    this.destinations.push(dest);
  }

  addMetaData(key: string, value: string): void {
    this.meta[key] = value;
  }

  async log(message: string, context?: object): Promise<void> {
    return this.#logMessage('log', message, context);
  }

  async debug(message: string, context?: object): Promise<void> {
    return this.#logMessage('debug', message, context);
  }

  async warn(message: string, context?: object): Promise<void> {
    return this.#logMessage('warn', message, context);
  }

  async info(message: string, context?: object): Promise<void> {
    return this.#logMessage('info', message, context);
  }

  async error(message: string, context?: object): Promise<void> {
    return this.#logMessage('error', message, context);
  }

  async processBuffer(): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.destinations.length) {
        console.warn('No destinations configured, erasing log message buffer');
        this.buffer = [];
        return resolve();
      }
      for (const bufferedMessage of this.buffer) {
        const { level, message, context } = bufferedMessage;
        await this.#fanOutMessageToAllDestinations(level, message, context);
      }
      this.buffer = [];
      return resolve();
    });
  }

  async #logMessage(level: LogLevel, message: string, context?: object): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.destinations.length) {
        this.buffer.push({ level, message, context });
        return resolve();
      }

      await this.#fanOutMessageToAllDestinations(level, message, context);

      return resolve();
    });
  }

  async #fanOutMessageToAllDestinations(level: LogLevel, message: string, context?: object): Promise<void> {
    return new Promise(async (resolve) => {
      for (const dest of this.destinations) {
        await dest.log(level, message, context, this.meta);
      }
      return resolve();
    });
  }
}

export default new Logger();
