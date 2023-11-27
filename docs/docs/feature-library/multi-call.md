---
sidebar_label: multi-call
title: multi-call
---

Out of the box, Flex does not allow a single worker to have more than one call active at once. Due to this limitation, another worker cannot transfer a call to another worker if they already are on a call. This feature allows a worker to handle two calls at once, and will automatically place other calls on hold when accepting a new call. As a result, a worker can gracefully handle a transferred call while already assigned another call.

![Multi-call demo](/img/features/multi-call/multi-call.gif)

## Setup and dependencies

This feature requires some TaskRouter configuration changes in addition to Flex configuration changes.

### TaskRouter

First, agents will need their capacity for the `voice` channel to be increased from 1 to 2. This can be done via the console, API, Single Sign On configuration, or via the `supervisor-capacity` plugin feature. This will enable TaskRouter to successfully transfer a call to a worker that already has another call.

Now that workers can accept multiple calls, we need to update the TaskRouter workflow(s) so that agents are not routed multiple calls from the queue. For each workflow filter, set the target worker expression to `worker.channel.voice.available_capacity_percentage == 100`. If you already have a target worker expression defined, you will need to combine the logic with `AND`.

> **Warning**
> Transfers to queues will not use the above configured worker expression. If workers in transfer queues do not all have their capacity set to 1, customize the queue transfer directory to instead transfer to workflows. Otherwise, transfers to queues may be assigned to workers already on calls.

### Flex configuration

In your flex-config file(s), two changes need to be made:

1. Enable the `multi_call` feature
2. Disable the `allowIncomingWhileBusy` voice SDK option (yes, this is counter-intuitive!)

## How it works

The reason that Flex does not support multiple simultaneous calls out-of-the-box is due to a limitation in the Twilio Voice JavaScript SDK used by Flex. To work around this limitation, the `multi-call` feature instantiates a second Voice SDK `Device` to handle a second incoming call. This works because disabling `allowIncomingWhileBusy` prevents the Voice SDK instance managed by Flex from receiving a second inbound call, allowing our second instance to handle it gracefully.

Due to the Voice SDK limitation, Flex's state maintains an assumption that only one call at a time may be considered active. To work around this, the `multi-call` feature changes the active call in Flex state whenever the selected task changes.

When handling more than one call at once, only one call should be heard by the agent at a time. To handle this, when accepting or un-holding a call, any other active call is immediately placed on hold and muted. Mute is toggled in addition to hold in order to prevent the agent from being recorded on the wrong call.

Finally, the teams view 'calls' column has been replaced and re-styled to prevent multiple calls from being cut off in the view.
