import { LogLevel } from '.';

interface DestinationConstructor {
  minLogLevel: LogLevel;
}

const logLevelMap = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
};

export default abstract class Destination {
  minLogLevel: LogLevel;

  constructor(opts: DestinationConstructor) {
    this.minLogLevel = opts.minLogLevel;
  }

  async log(level: LogLevel, message: string, context: any, meta: any): Promise<void> {
    // numeric level of current log passing through
    const levelOfCurrentLog = logLevelMap[level];
    // minimum configured log level
    const minimum = logLevelMap[this.minLogLevel];

    if (levelOfCurrentLog >= minimum) {
      this.handle(level, message, context, meta);
    }
  }

  abstract handle(level: LogLevel, message: string, context: any, meta: any): Promise<void>;
}
