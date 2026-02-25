---
sidebar_label: conditional-recording
title: conditional-recording
---

Flex includes a built-in call recording feature which can be enabled via the Twilio Console > Flex > Manage > Voice. This records the conference for every call handled within Flex, in either single- or dual-channel.

However, for regulatory compliance purposes, some implementations may need to prevent recording certain calls. This feature adds that capability to the built-in call recording feature, by preventing recording based on task queue or based on the presence of certain task attributes. The task attributes and/or task queues that should be excluded from recording are configurable.

:::info dual-channel-recording feature
The `conditional-recording` feature works with the native call recording functionality. It is not applicable in conjunction with [the template's `dual-channel-recording` feature](/feature-library/dual-channel-recording), which has its own conditional recording functionality.
:::

## Setup and dependencies

If you are enabling the conditional recording feature, you must also **enable** the call recording flag within Twilio Console > Flex > Manage > Voice, otherwise recordings will not be accessible via Flex Insights.

The `conditional-recording` feature has the following settings:
- `enabled` - Set to `true` to enable the feature
- `exclude_attributes` - To exclude recording tasks based on the task attributes present, set this to an array of key/value pair objects. For example, to prevent recording outbound calls:
  ```json
  "exclude_attributes": [{ "key":"direction", "value":"outbound" }]
  ```
- `exclude_queues` - To exclude recording tasks based on queue name or queue SID, set this to an array of queue names or SIDs. For example:
  ```json
  "exclude_queues": ["Queue Name 1", "Queue Name 2"] // or ["WQxxx", "WQyyy"]
  ```

### Attribute matching

The attribute matching system also supports two advanced features:

#### Nested Attributes
You can exclude recording based on nested attributes using dot notation:
```json
"exclude_attributes": [
  { "key": "customer.vip", "value": "true" },
  { "key": "conversations.sentiment", "value": "sensitive" }
]
```

#### Array Matching
If an attribute value is an array, the matcher will check if the configured value exists anywhere in that array:
```json
"exclude_attributes": [{ "key": "tags", "value": "do-not-record" }]
```
This would exclude recording for any task where the `tags` array contains "do-not-record", even if it has other values like `"tags": ["urgent", "do-not-record", "escalated"]`.

## How it works

Before an inbound or outbound call task is accepted, the task is evaluated based on the defined attributes and/or queues to exclude from recording. The `payload.conferenceOptions.conferenceRecord` flag is set to `true` or `false` depending on the outcome of this evaluation. If this flag is set to `true`, then TaskRouter will initiate the conference recording immediately upon conference start.
