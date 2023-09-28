import Destination from './destination';

export type LogLevel = 'log' | 'debug' | 'warn' | 'info' | 'error';

class Logger {
  destinations: Destination[] = [];

  meta: any = {};

  async log(message: string, context = {}): Promise<void> {
    this.logMessage('log', message, context);
  }

  async debug(message: string, context = {}): Promise<void> {
    this.logMessage('debug', message, context);
  }

  async warn(message: string, context = {}): Promise<void> {
    this.logMessage('warn', message, context);
  }

  async info(message: string, context = {}): Promise<void> {
    this.logMessage('info', message, context);
  }

  async error(message: string, context = {}): Promise<void> {
    this.logMessage('error', message, context);
  }

  async logMessage(level: LogLevel, message: string, context = {}): Promise<void> {
    if (!this.destinations.length) {
      console.warn('logger.logMessage called - but no destinations are yet configured', { level, message, context });
      return;
    }

    this.destinations.forEach((dest) => {
      dest.log(level, message, context, this.meta);
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
