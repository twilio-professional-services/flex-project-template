---
sidebar_label: internal-call
title: internal-call
---

This feature adds a new "Call Agent" section to the outbound dialpad allowing an agent to directly call another agent. In this section, there is an autocomplete dropdown where you can select the agent you want to call.

This feature is based on [the dialpad addon plugin](https://github.com/twilio-professional-services/flex-dialpad-addon-plugin).

## flex-user-experience

![Internal call demo](/img/features/internal-call/internal-call.gif)

## setup and dependencies

### Outbound Call Configuration

When placing the internal call, the default outbound call settings are used. If this has not yet been configured, you will encounter errors. This can be updated using the Flex Configuration API:

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

### TaskRouter

Before using this plugin you must first create a dedicated TaskRouter workflow or just add the following filter to your current workflow. Make sure it is part of your Flex Task Assignment workspace.

- name the workflow "Internal Call"
- ensure the following matching worker expression: _task.targetWorker==worker.contact_uri_
- ensure the priority of the filter is set to 1000 (or at least the highest in the system)
- make sure the filter matches to a queue with Everyone on it. The default Everyone queue will work but if you want to seperate real time reporting for outbound calls, you should make a dedicated queue for it with a queue expression _1==1_

![Workflow filter configuration](/img/features/internal-call/outbound-filter.png)

In the `serverless-functions/.env` file, be sure to set `TWILIO_FLEX_INTERNAL_CALL_WORKFLOW_SID` to the SID of the workflow configured above (and set `TWILIO_FLEX_WORKSPACE_SID` if it has not been already). If your workflow name begins with "Internal Call", the `npm install` script, `npm run generate-env` script, and the included CI scripts will automatically populate these SIDs for you.

## how does it work?

After selecting and clicking the call button, the WorkerClient's createTask method is used to create the outbound call task having the caller agent as target. When the task is sent to this agent, the AcceptTask action is overridden so we can control all the calling process. Then, we use the reservation object inside the task payload to call the caller agent. This reservation object is part of the TaskRouter JavaScript SDK bundled with Flex. The URL endpoint of this call is used and pointed to a Twilio Function that returns TwiML which in turn creates a conference and sets the statusCallbackEvent. The latter endpoint will be used to create the called agent task.

On the called agent side, the AcceptTask action is also overridden and a similar calling process is done. The difference is that the URL endpoint points to a different Twilio Function that returns simple TwiML which in turn calls the conference created on the caller side.

## Known issues

1. When in an agent-to-agent call, the internal transfer button is hidden, as Flex does not handle this scenario correctly.
2. When in an agent-to-agent call, an external transfer is done correctly, but the UI does not reflect what is going on.
