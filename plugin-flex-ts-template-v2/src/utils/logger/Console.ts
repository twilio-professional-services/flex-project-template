import { LogLevel } from '.';
import Destination from './destination';

export default class Console extends Destination {
  async handle(level: LogLevel, message: string, context?: object, meta?: object): Promise<void> {
    return new Promise((resolve) => {
      let additonalContext: object = {};
      additonalContext = Object.assign(additonalContext, meta, context);

      // if there is additional context, use it
      if (Object.keys(additonalContext).length) {
        console[level](message, additonalContext);
      } else {
        console[level](message);
      }

      return resolve();
    });
  }
}
