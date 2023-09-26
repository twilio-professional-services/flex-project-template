---
sidebar_label: caller-id
title: caller-id
---

This feature enables the user to define which number on the Twilio account to use when dialing outbound using the dialpad.

# flex-user-experience

the vanilla feature without any further customizations will look like this

![alt text](/img/features/caller-id/flex-user-experience.gif)

# setup and dependencies

## Enabling the feature

There are no additional dependencies for setup beyond ensuring the flag is enabled within the `flex-config` attributes.

There is an optional configuration property (`include_outgoing_only_numbers`) controlling whether or not outgoing-only caller IDs (i.e. verified non-Twilio phone numbers) are displayed in the dropdown. This is enabled by default, but can be disabled to hide these numbers.

```json
"caller_id": {
    "enabled": true,
    "include_outgoing_only_numbers": false
}
```

## Outbound Call Configuration

The Flex Dialpad must be enabled in order to be able to place outbound calls from within Flex. If this has not yet been configured, you will not be able to use this feature. This can be enabled in the Twilio Console > Flex > Manage > Voice, or by using the Flex Configuration API:

```
POST https://flex-api.twilio.com/v1/Configuration
Authorization: Basic {base64-encoded Twilio Account SID : Auth Token}
Content-Type: application/json

{
  "account_sid": "Enter your Twilio Account SID here",
  "outbound_call_flows": {
    "default": {
      "workflow_sid": "WWxxxc",
      "enabled": true,
      "queue_sid": "WQxxx",
      "caller_id": "+1xxx",
      "location": "US"
    }
  },
}
```

# how does it work?

When enabled, this feature loads the phone numbers on the account using a serverless function, caches them locally, preserve the selected value against the worker attributes. When the [StartOutboundCall](https://assets.flex.twilio.com/docs/releases/flex-ui/2.0.0-beta.1/ui-actions/Actions#StartOutboundCall) action is invoked, we intercept the event before its processed and update the From number to use the selected value stored on the worker attributes.
