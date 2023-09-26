---
sidebar_label: park-interaction
title: park-interaction
---

## Feature summary

This feature adds a pause/park button to messaging conversations so that while waiting for a response, an agent can be freed up for new work, while also maintaining conversation history. Next time the customer writes a message, if the conversation was parked, it will route through the workflow again for worker assignment, and the history of the conversation will be present when a worker accepts the task.

Furthermore, you have the option to enable the 'Parked Interactions' list, which empowers agents to access and manage parked conversations, with a specific focus on Web Chat and WhatsApp. This list allows agents to efficiently unpark conversations directly from their interface. Details [here](#parked-interactions-list-details).

## Flex User Experience

![Park interaction demo](/img/features/park-interaction/park-interaction.gif)

Additional Parked Interactions list

![Unpark interaction demo](/img/features/park-interaction/unpark-interaction.gif)

## Setup and dependencies

To enable the parking feature, under your `flex-config` attributes set the `park_interaction` `enabled` flag to `true`. To enable the recent interaction view, set the `show_list` to `true`.

```json
"park_interaction": {
    "enabled": true,
    "show_list": true
}
```

You may need a different use case then what this plugin does today. For example, currently when the customer writes a message, the task is routed to same workflow as the originally parked task. If you instead need to route back to a specific agent or queue, you can adjust your TaskRouter workflow to use the included `originalRouting.queueName`,`originalRouting.queueSid`, and/or `originalRouting.workerSid` task attributes, or you could modify the `unpark-interaction` serverless function to route directly using the queue and worker SIDs ([details for this example here](https://www.twilio.com/docs/flex/developer/conversations/park-an-interaction#add-a-specific-agent-back-to-the-interaction)). Alternatively, if you wish to route the interaction through a Studio flow when the customer replies, you could change the webhook URL in the `park-interaction` serverless function to a Studio flow webhook URL.

## How does it work?

This feature is based in the instructions given on our doc on how to [Park an Interaction](https://www.twilio.com/docs/flex/developer/conversations/park-an-interaction). In the legacy Flex this functionality was known as "long-lived channels".

### Parked Interactions List details
- This feature leverages Sync MapItems to store the state of recently parked interactions, with a time-to-live (TTL) of 24 hours
- Attempting to unpark a closed or failed conversation will result in an error
- While unparking an interaction, the associated Sync MapItem is deleted, for both scenarios (customer or worker-initiated). The `unpark-interaction` serverless function checks if the conversation has `mapSid` and `mapItemKey` attributes, which are only added when it's being parked and the `show_list` option is enabled
- If the unparking is worker-initiated from the list, `queue_id` and `worder_sid` attributes are added to the request, so the interaction is routed directly to the worker. Otherwise, if customer-initiated, these are not added