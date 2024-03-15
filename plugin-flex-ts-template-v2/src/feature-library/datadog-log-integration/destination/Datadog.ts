import querystring from 'querystring';

import Destination from '../../../utils/logger/destination';
import { LogLevel } from '../../../utils/logger';
import { DatadogDestinationConfig } from '../types/ServiceConfiguration';

export default class DatadogDestination extends Destination {
  buffer: any[] = [];

  api: string = '';

  // eslint-disable-next-line no-restricted-syntax
  constructor(opts: DatadogDestinationConfig) {
    super({ minLogLevel: opts.minLogLevel });

    const { flushTimeout, apiKey, intakeRegion } = opts;

    if (intakeRegion === 'eu') {
      this.api = `https://http-intake.logs.datadoghq.eu/api/v2/logs`;
    } else if (intakeRegion === 'us3') {
      this.api = `https://http-intake.logs.us3.datadoghq.com/api/v2/logs`;
    } else if (intakeRegion === 'us5') {
      this.api = `https://http-intake.logs.us5.datadoghq.com/api/v2/logs`;
    } else {
      this.api = `https://http-intake.logs.datadoghq.com/api/v2/logs`;
    }

    const query = {
      'dd-api-key': apiKey,
    };
    const qs = querystring.encode(query);

    this.api = `${this.api}?${qs}`;

    setInterval(() => {
      this.flush();
    }, flushTimeout);
  }

  async handle(level: LogLevel, message: string, context: any, meta: any): Promise<void> {
    return new Promise((resolve) => {
      this.buffer.push({
        level,
        message,
        context,
        meta,
      });
      return resolve();
    });
  }

  hasUnsentLogs(): boolean {
    return Boolean(this.buffer.length);
  }

  async flush(): Promise<void> {
    if (!this.hasUnsentLogs()) {
      return;
    }

    try {
      await fetch(this.api, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(this.buffer),
      });
    } catch (err) {
      console.error(err);
    } finally {
      // reset the buffer
      this.buffer = [];
    }
  }
}
