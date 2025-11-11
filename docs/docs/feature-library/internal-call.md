---
sidebar_label: internal-call
title: internal-call
---
import PluginLibraryFeature from "./_plugin-library-feature.md";

<PluginLibraryFeature />

This feature adds a new "Call Agent" and "Call Queue" section to the outbound dialpad allowing an agent to directly call another agent or to a queue. In this section, there is an autocomplete dropdown for both options where you can select the appropriate party you want to call.

## Flex User Experience

![Internal call demo](/img/features/internal-call/internal-call.gif)

## Setup and Dependencies

### Outbound Call Configuration

Internal calls are placed from the Flex Dialpad. In order to enable access to the dialpad, it must be configured. This can be updated in the [Twilio Console > Flex > Channel management > Voice](https://console.twilio.com/us1/develop/flex/channels/voice), or by using the Flex Configuration API:

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

### Routing Configuration

If you have deployed the template with the option to use Terraform selected, all of the steps here have been performed for you already. The following steps are intended to support manual deployments.

#### TwiML App

To provide a call target for Flex, we must create a TwiML app, via [Twilio Console > Phone Numbers > Manage > TwiML apps](https://console.twilio.com/us1/develop/phone-numbers/manage/twiml-apps?frameUrl=%2Fconsole%2Fvoice%2Ftwiml%2Fapps%3Fx-target-region%3Dus1). Create a new TwiML app with the following configuration:

- Friendly Name: Internal Call
- Voice Configuration:
  - Request URL: `https://custom-flex-extensions-serverless-XXXX-dev.twil.io/features/internal-call/common/enqueue`
    - Adjust the serverless domain in the above URL to match your deployed serverless service.
  - Request Method: HTTP POST

After saving the new TwiML app, select it and note the `TwiML App SID`, as we will use it later. If the friendly name was set to "Internal Call", the `npm install` script, `npm run generate-env` script, and the included CI scripts will automatically populate these SIDs for you.

#### TaskRouter

In order to route internal calls, you must first create a dedicated TaskRouter workflow (or add the following filters to an existing workflow). Make sure the workflow is part of your Flex Task Assignment workspace.

- Name the workflow "Internal Call"
- Add a filter for assigning to agents with the "Matching tasks" expression set to `worker_sid != null AND callToQueue == null`
  - Add a target to the filter pointed to a queue with everyone in it. The default Everyone queue will work, but if you want to separate real time reporting for outbound calls, you should make a dedicated queue for it with a queue expression `_1==1_`.
  - Within the target, set "Known worker" to "Worker SID", and set the known worker SID to `task.worker_sid`.
  - Ensure the priority of the filter is set to 1000 (or at least the highest in the system).
- To enable internal calling to queues, create a filter for each queue with matching task expression as: `callToQueue == 'queue_name'`
  - Add a routing target to each of these filters pointed to the corresponding queue.

![Workflow agent filter configuration](/img/features/internal-call/agent-filter.png)

![Workflow queue filter configuration](/img/features/internal-call/queue-filter.png)

In the `serverless-functions/.env` file, be sure to set `TWILIO_FLEX_INTERNAL_CALL_WORKFLOW_SID` to the SID of the workflow configured above (and set `TWILIO_FLEX_WORKSPACE_SID` if it has not been already). If your workflow name begins with "Internal Call", the `npm install` script, `npm run generate-env` script, and the included CI scripts will automatically populate these SIDs for you.

### Feature Configuration

Within your `ui_attributes` file, the `internal-call` feature has settings you may modify:

- `enabled` - whether any functionality from this feature is enabled
- `enable_call_agent` - whether to allow agents to call other agents directly
- `enable_call_queue` - whether to allow agents to call queues directly
- `application_sid` - the TwiML app SID from the "Routing Configuration" section above
- `outbound_queue_sid` - the task queue SID to use for the outbound leg of internal calls

## How does it work?

After selecting the appropriate party (agent/queue) and clicking the call button, the `StartOutboundCall` action is invoked to place a call to the TwiML app configured for this feature, with the target party (queue or worker SID) passed as a parameter to the app. The TwiML app will then invoke the `enqueue` serverless function, which returns TwiML to enqueue the call with the configured TaskRouter workflow. Depending on whether an agent or queue is being called, there will be a `worker_sid` or a `callToQueue` attribute added to the task, which is used by the workflow to route the task appropriately.