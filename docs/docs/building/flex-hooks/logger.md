Use a loggerHook to add your own log destinations.

Here is the loggerHook from the [`console-log-integration`](/flex-project-template/feature-library/console-log-integration) feature.

Location: `plugin-flex-ts-template-v2/src/feature-library/console-log-integration/flex-hooks/logger/index.ts`

```ts
import Console from '../../destination/Console';
import { getLogLevel } from '../../config';

export const loggerHook = function sendLogsToBrowserConsole() {
  // by default the Console logger should ignore meta data
  return new Console({ minLogLevel: getLogLevel(), metaData: null });
};
```

The loggerHook function should return a new class that implements the Logging Utility's abstract Destination class.

This class (Console in this example) is passed the log message from the logging Utility and is free to send that log message anywhere it likes. In this case - it sends the log message to the browser console.

See the [Logging Utility Documentation](/flex-project-template/building/template-utilities/logging) for more information.
