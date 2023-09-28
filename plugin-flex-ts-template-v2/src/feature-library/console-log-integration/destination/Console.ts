import { LogLevel } from '../../../utils/logger';
import Destination from '../../../utils/logger/destination';

export default class Console extends Destination {
  async handle(level: LogLevel, message: string, context: any, meta: any): Promise<void> {
    return new Promise((resolve) => {
      console[level](message, Object.assign(context, meta));
      return resolve();
    });
  }
}
