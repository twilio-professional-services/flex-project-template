---
sidebar_label: console-log-integration
title: console-log-integration
---

Send logs to the Browser Console.

Example

```ts
import logger from '/utils/logger';

logger.debug('This is a debug message');
```

## flex-config

Within your `ui_attributes` file, the `console-log-integration` feature has 2 settings you may modify:

- `enable` - whether any functionality from this feature is enabled
- `log_level` - Minimum log level to send to the broswer console.

## More Information

Read more about logging in the [Logging Utility Documentation](/flex-project-template/building/template-utilities/logging).
