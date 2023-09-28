import Destination from './destination';

export type LogLevel = 'log' | 'debug' | 'warn' | 'info' | 'error';

class Logger {
  destinations: Destination[] = [];

  meta: any = {};

  async log(message: string, context = {}): Promise<void> {
    return this.logMessage('log', message, context);
  }

  async debug(message: string, context = {}): Promise<void> {
    return this.logMessage('debug', message, context);
  }

  async warn(message: string, context = {}): Promise<void> {
    return this.logMessage('warn', message, context);
  }

  async info(message: string, context = {}): Promise<void> {
    return this.logMessage('info', message, context);
  }

  async error(message: string, context = {}): Promise<void> {
    return this.logMessage('error', message, context);
  }

  async logMessage(level: LogLevel, message: string, context = {}): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.destinations.length) {
        console.warn('logger.logMessage called - but no destinations are yet configured', { level, message, context });
        return resolve();
      }

      for (const dest of this.destinations) {
        await dest.log(level, message, context, this.meta);
      }

      return resolve();
    });
  }

  addDestination(dest: Destination): void {
    this.destinations.push(dest);
  }

  addMetaData(key: string, value: string): void {
    this.meta[key] = value;
  }
}

export default new Logger();
