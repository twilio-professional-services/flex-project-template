---
sidebar_label: park-interaction
sidebar_position: 20
title: park-interaction
---

## Feature summary

This feature adds a pause/park button to messaging conversations so that while waiting for a response, an agent can be freed up for new work, while also maintaining conversation history. Next time the customer writes a message, if the conversation was parked, it will route through the workflow again for worker assignment, and the history of the conversation will be present when a worker accepts the task.

## Flex User Experience

![Park interaction demo](/img/f2/park-interaction/park-interaction.gif)

## Setup and dependencies

To enable the parking feature, under your `flex-config` attributes set the `park_interaction` `enabled` flag to `true`:

```json
"park_interaction": {
    "enabled": true
}
```

You may need a different use case then what this plugin does today. For example, currently when the customer writes a message, the task is routed to same workflow as the originally parked task. If you instead need to route back to a specific agent or queue, you can adjust your TaskRouter workflow to use the included `originalRouting.queueName`,`originalRouting.queueSid`, and/or `originalRouting.workerSid` task attributes, or you could modify the `unpark-interaction` serverless function to route directly using the queue and worker SIDs ([details for this example here](https://www.twilio.com/docs/flex/developer/conversations/park-an-interaction#add-a-specific-agent-back-to-the-interaction)). Alternatively, if you wish to route the interaction through a Studio flow when the customer replies, you could change the webhook URL in the `park-interaction` serverless function to a Studio flow webhook URL.

## How does it work?

This feature is based in the instructions given on our doc on how to [Park an Interaction](https://www.twilio.com/docs/flex/developer/conversations/park-an-interaction). In the legacy Flex this functionality was known as "long-lived channels".
