---
title: Logging
---

The Flex Project Template has a logging integration that allows features to register new destinations to receive any logs emitted by the code of the template and its associated features.

## How to use

While developing a custom feature for the template, instead of sprinkling your functions and components with `console.log/warn/error` statements, you can now import our custom logging utility.

Example

```ts
import logger from '/utils/logger';

logger.debug('This is a debug message');
```

Here are the log levels currently supported by the template.

| Level | Description                                                                              |
| ----- | ---------------------------------------------------------------------------------------- |
| debug | The most verbose and lowest level of logging supported in the template.                  |
| log   | Less granular than debug. Is used like `console.log`                                     |
| info  | Less granular than log.                                                                  |
| warn  | Less granular than info. Indicates something unexpected has happened.                    |
| error | Least granular. Should be reserved when the application is unable to complete an action. |

The `logger` has methods for each log level.

```ts
logger.debug('This is a debug message');
logger.log('This is a log message');
logger.info('This is an info message');
logger.warn('This is a warn message');
logger.error('This is an error message');
```

### Log Context

You can submit more than a simple message as a log. You can submit a context object with whatever data you want.

```ts
logger.log('This is a log message with context', { task, worker, ...otherContext });
```

### Log MetaData

You may want to include meta data with every single log message, without resolving the data and placing it in the log context.

For Flex, a great example of this is to append the worker's name and sid to each log message. We could use context to do this, but these values are not always easily resolvable from components or functions.

This logger utility supports adding global meta data to the Logger class with an `addMetaData` method.

```ts
import logger from '/utils/logger';

logger.addMetaData(key, value);
```

The Flex Project Template will automatically append the workerSid and worker name to each log message. Feel free to add other metadata as you see fit.

### Yes, you can still use console.log if you want

If for some reason this logging utility does not meet your needs - you are free to use `console.log/warn/error` directly.

### Flex Error Integration

The logger will automatically listen for and log with `logger.error()` all [Flex Errors Events](https://www.twilio.com/docs/flex/developer/ui/errors-and-debugging#listening-to-the-flexerror-event) automatically.

## Destinations

Destinations are an important concept for this logging utility. A destination is where the logs should go. It can be something simple, like the browser console, or something more complex like an external logging aggregator like Datadog.

This logging utility can support any number of destinations - by default the template sends all logs to the browser console.

### Writing Custom Destinations

If you wish to provide a custom destination for the logger, you only need to add a logger directory under your `flex-hooks` folder of your feature.

Each logging hook must provide an instantiated class that extends `utils/logger/destination.ts`.

```ts
import { LogLevel } from '../../../utils/logger';
import Destination from '../../../utils/logger/destination';

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
```

If you're writing a custom destination class you need to implement an async handle method shown above (for the Browser Console feature) - which will receive the log `level`, `message` and optionally `context` (if provided) and any `metadata` that may have been set.

This logging utility will invoke your destination's handle method each time the logger is given a message. Keep this in mind when doing expensive operations like sending logs to a destination through HTTP. You may need to buffer the log messages and bulk them into a single HTTP request as opposed to sending an HTTP request each time your handle method is invoked.

### Configuring Custom Destinations

The abstract Destination class in `utils/logger/destination.ts` has a constructor method that is expecting to receive some configuration, such as the minimum log level that this destination is interested in, and whether or not to honor global meta data, or to even add meta data specific only to this destination.

When you instantiate your custom destination class as part of your logger hook in your feature, you will need to provide it with this configuration in its constructor.

```ts
import Console from '../../destination/Console';
import { getLogLevel } from '../../config';

export const loggerHook = function sendLogsToBrowserConsole() {
  // by default the Console logger should ignore meta data
  return new Console({ minLogLevel: getLogLevel(), metaData: null });
};
```

Notice, that when we instantiate the `Console` class, we pass it a `minLogLevel` and `metaData` options.

The `minLogLevel` option can be any log level value, such as `debug`, `log`, `info`, `warn`, or `error`. If you would like your destination to receive ALL logs, choose the `debug` option for `minLogLevel`. The logger will send you any logs at the level you choose and above. So for example, if you set the `minLogLevel` to `info` - your destination will receive any logs marked as `info`, `warn`, and `error`.

### Custom Destinations and MetaData

Destinations can choose to ignore all global metaData by passing `{ metaData: null }` as we have done for the Console destination. The Browser Console doesn't really need to have the worker's meta data revealed as this is implied by viewing the browser console.

However, other destinations may want to append their own meta data - on top of the global meta data (set at the logger level) - and used only for their destination. If this is the case for your destination, simply set `metaData: { key, value}` to an object containing the keys and values you wish to use as meta data.

### Log Buffering

Because destinations will be part of features in the feature library and these are loaded in order. Its possible that a feature preceeding the one that loads your destination will be writing logs to the logger, but since your destination has not yet been configured you might not receive those logs.

In order to avoid this, this logging utility will buffer all logs written during feature loading and flush them once all features have been loaded. This ensures that no matter when your feature is loaded - you will receive the logs from all other features - assuming your destination is configured to receive messages at that log level.
