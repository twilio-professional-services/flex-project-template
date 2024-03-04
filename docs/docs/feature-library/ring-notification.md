---
sidebar_label: ring-notification
title: ring-notification
---

## Overview

The ring notification feature plays a ringtone sound for incoming tasks.

---

## Business Details

### Context

Currently Flex does not play a ring notification to agents for an incoming task out of the box. Because of this, sometimes agents miss the task if they are focusing on some other screen than the Flex agent desktop.

### Objective

This `ring-notification` feature will allow Flex to play a ringtone on the agent's side for incoming tasks until the reservation `accepted`, `canceled`, `rejected`, `rescinded`, or `timeout` events occur.

### Configuration options

There are no additional dependencies for setup beyond ensuring the flag is enabled within the `flex-config` attributes.

To enable the feature, under the `flex-config` attributes set the `ring_notification` `enabled` flag to `true`.

```json
"ring_notification": {
  "enabled": true
}
```

The ringtone mp3 file is stored as a serverless asset at `serverless-functions/assets/features/ring-notification/phone_ringtone.mp3`. You may change the ringtone by overwriting this file.

:::info Browser autoplay behavior
Most popular browsers will block automatically played audio if the user has not interacted with the webpage. This means that if the user has just opened Flex, and has not yet interacted with Flex, the notification audio will not play until user interaction occurs. [More details, including workarounds, are available here.](https://www.twilio.com/docs/flex/developer/ui/sound-and-audio#troubleshooting)
:::

## Technical Details

This feature plays a ring notification on the reservation `created` event and it stops playing on reservation `accepted`, `canceled`, `rejected`, `rescinded`, or `timeout` events.
