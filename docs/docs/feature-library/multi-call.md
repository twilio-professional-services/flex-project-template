---
sidebar_label: multi-call
title: multi-call
---

:::info Flex UI 2.8 or later required
This feature requires Flex UI 2.8 or later, as it depends on Twilio Voice SDK features that were unavailable prior to that version.
:::

Out of the box, Flex does not allow a single worker to have more than one call active at once. Due to this limitation, another worker cannot transfer a call to another worker if they already are on a call. This feature allows a worker to handle more than one call at once, and will automatically place other calls on hold when accepting a new call. As a result, a worker can gracefully handle a transferred call while already assigned another call, for example.

![Multi-call demo](/img/features/multi-call/multi-call.gif)

## Setup and dependencies

This feature requires some TaskRouter configuration changes in addition to Flex configuration changes.

### TaskRouter

First, agents will need their capacity for the `voice` channel to be increased from 1 to a larger number. This can be done via the console, API, Single Sign On configuration, or via the `supervisor-capacity` plugin feature. This will enable TaskRouter to successfully transfer or assign a call to a worker that already has another call.

Now that workers can accept multiple calls, if you want to route inbound calls to only workers not already on a call, we need to update the TaskRouter workflow(s) so that agents are not routed multiple calls from the queue. For each workflow filter, set the target worker expression to `worker.channel.voice.available_capacity_percentage == 100`. If you already have a target worker expression defined, you will need to combine the logic with `AND`.

:::warning
Transfers to queues will not use the above configured worker expression. If workers in transfer queues do not all have their capacity set to 1, customize the queue transfer directory to instead transfer to workflows. Otherwise, transfers to queues may be assigned to workers already on calls.
:::

### Flex configuration

In your flex-config file(s), all you need to do is enable the `multi_call` feature.

:::tip
If you wish to use this feature with outbound calling (for example, to allow a worker to receive an inbound call while already handling an outbound call), even though this feature can handle the scenario successfully, Flex will display an alert dialog to reject the incoming call or disconnect the outbound call. Please contact Twilio Support to enable a feature flag on your account to disable the multi call alert dialog.
:::

## How it works

The reason that Flex does not support multiple simultaneous calls out-of-the-box is due to a limitation in the Twilio Voice JavaScript SDK used by Flex. To work around this limitation, when another call is accepted, the `multi-call` feature instantiates a second Voice SDK `Device` and forwards the call to it. This new instance of the Voice SDK is then passed the same configuration options as the built-in Voice SDK instance.

Due to the Voice SDK limitation, Flex's state maintains an assumption that only one call at a time may be considered active. To work around this, the `multi-call` feature changes the active call in Flex state whenever the selected task changes.

When handling more than one call at once, only one call should be heard by the agent at a time. To handle this, when accepting or un-holding a call, any other active call is immediately placed on hold and muted. Mute is toggled in addition to hold in order to prevent the agent from being recorded on the wrong call.

Finally, the teams view 'calls' column has been replaced and re-styled to prevent multiple calls from being cut off in the view.
