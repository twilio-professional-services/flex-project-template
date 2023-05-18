---
sidebar_label: conference
sidebar_position: 9
title: conference
---

When in a call, and the beta native external warm transfer functionality is not enabled, a "plus" icon is added to the call canvas where you can add an external number to the call.

If the beta native external warm transfer functionality is enabled, this feature still adds the ability for a caller to hang up without ending the conference, as well as the ability to kick the customer participant.

This feature is based on [the dialpad addon plugin](https://github.com/twilio-professional-services/flex-dialpad-addon-plugin).

# flex-user-experience

![Conference demo](/img/f2/conference/conference.gif)

# setup and dependencies

## flex-config

Within your `ui_attributes` file, the `conference` feature has 3 settings you may modify:

- `enable` - whether any functionality from this feature is enabled
- `hold_workaround` - without the hold workaround, after a third participant is added to the conference while the caller is on hold, the entire conference will end if the caller hangs up. when the workaround is enabled, the customer will be taken off hold briefly when the third participant is added, then placed back on hold. This workaround allows the caller to later disconnect without ending the entire conference.

## Outbound Call Configuration

When conferencing in an external party, the default outbound call settings are used for caller ID. If this has not yet been configured, you will encounter errors. This can be updated in the Twilio Console > Flex > Manage > Voice, or by using the Flex Configuration API:

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

## TaskRouter

In the `serverless-functions/.env` file, be sure to set `TWILIO_FLEX_WORKSPACE_SID` if it has not been already.

# how does it work?

This action executes a Twilio Function that uses the Twilio API to make a call and add this call to the current conference. In the Flex UI side, the participant is added manually and both hold/unhold and hangup buttons are available.

An invisible component is mounted to track participant state and set `endConferenceOnExit` appropriately to allow for external transfer functionality -- the agent can leave the call while the remaining conference participants continue to communicate. If there are two parties remaining, the call will automatically end when one of them hangs up.
