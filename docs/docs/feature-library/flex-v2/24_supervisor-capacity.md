---
sidebar_label: supervisor-capacity
sidebar_position: 25
title: supervisor-capacity
---

This feature implements a _Channel Capacity_ panel in the [Twilio Flex](https://www.twilio.com/flex) [Teams View](https://www.twilio.com/docs/flex/monitor-agent-activity). Supervisors may configure each worker's capacity per channel, as well as whether or not a worker is eligible to receive tasks for that channel.

# flex-user-experience

![Supervisor capacity demo](/img/f2/supervisor-capacity/supervisor-capacity.gif)

# setup and dependencies

Enable the feature in the flex-config asset for your environment. Optionally, you may also include a `rules` object in the feature configuration. Within the `rules` object, you may specify which channels should be displayed, and the allowed capacity range for that channel. If the `rules` object is present, only the channels specified will be displayed. If the `rules` object is not present, all channels will be displayed.

Here is an example configuration with `rules`:

```
"supervisor_capacity": {
  "enabled": true,
  "rules": {
    "voice": {
      "min": 0,
      "max": 1
    },
    "chat": {
      "min": 0,
      "max": 7
    }
  }
}
```

# how does it work?

Twilio Functions are used to query and update worker channel configuration via the TaskRouter API.
