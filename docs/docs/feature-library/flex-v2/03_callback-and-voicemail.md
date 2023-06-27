---
sidebar_label: callback-and-voicemail
sidebar_position: 4
title: callback-and-voicemail
---

This feature enables the creation of callbacks and voicemails as custom task types - by means of a Serverless Functions API. It also provides the UI to handle these special types of task in Flex - by means of Flex Plugin components. It is a generic reference implementation intended to be customized to meet the needs of any particular use case, and ultimately accelerate the development of callback and voicemail functionality - both on the the front end (Flex), and in the IVR (e.g. Studio).

The feature is inspired by the work in the [Queued Callback and Voicemail](https://www.twilio.com/docs/flex/solutions-library/queued-callback-and-voicemail) Twilio Solution Library, however it has a few key aspects that it improves upon:

- Callbacks and voicemails are placed on the 'voice' channel by default, as it's standard for such work to be threaded in single file with voice calls (i.e. an agent would not want to be handling any of these tasks concurrently with actual voice call tasks). NOTE: The Serverless Functions API we've exposed does allow the task channel to be overridden if desired.
- There is a Serverless Functions API for creating the callback or voicemail, so you just have to create your UX and then decide when and where to create the callback. No need to peel apart the sample solution for the task creation logic.
- [Creating a callback or voicemail](https://github.com/twilio-professional-services/flex-project-template/blob/main/serverless-functions/src/functions/features/callback-and-voicemail/studio/create-callback.protected.js) has a little more resiliency built in as it uses a retry handler provided by our common wrappers provided by this template. Maximum retry attempts are configurable under this framework.
- Callbacks and voicemails use a shared set of components and functions, as voicemails are effectively callbacks with a voicemail recording (and possibly a transcription) attached.
- The callback or voicemail task can be automatically selected after the outbound call back to the contact ends, allowing for a smoother call wrapup process.
- A robust wait experience (aka `waitUrl` endpoint) is provided - which uses a more robust Task API query to find the task associated with the Call SID. This addresses the documented scalability issue of the solution library approach - which uses `EvaluateTaskAttributes` for getting the pending task SID (an API that's strictly rate limited to 3 requests per second).
- Voicemail retrieval works with recording media HTTP authentication enabled or disabled

# Flex User Experience

The vanilla feature without any further customizations will look like this for callbacks

![alt text](/img/f2/callback-and-voicemail/flex-user-experience.gif)

Voicemails will look like this

![alt text](/img/f2/callback-and-voicemail/flex-user-experience-vm.gif)

And Voicemails created from the Transcription Callback URL will look like this

![alt text](/img/f2/callback-and-voicemail/flex-user-experience-vm-with-trans.gif)

# How Does it Work?

The feature works by registering custom Flex Channels for callbacks and voicemails. These channels are a presentation only layer, on top of the Taskrouter Task Channel, which remains 'voice'.

When the channel is registered, it renders custom components based on the task attribute; _taskType: callback_ or _taskType: voicemail_

There are two associated serverless functions called _create-callback_.

The only difference between these functions is one is intended to be called from Flex, the other from anywhere else, but typically Studio (could also be from a TwiML app). The difference is the security model for each function but both do the same thing, taking in task attributes and generating a new callback (or voicemail) task (via a common utility). The Flex interface is used for the re-queueing feature.

When retrieving voicemail, the `fetch-voicemail` function is invoked. This fetches the recording media using HTTP authentication and returns it base64-encoded to Flex UI.

# Setup and Dependencies

Once you've set the flag for the feature in flex-config, and all of that is deployed, you now have a functioning callback and voicemail feature! Now you just need to create some callbacks and/or voicemails via Studio or TwiML.

## Creating a Callback Task Using _create-callback_ Function

Creating a callback involves creating a task with at a minimum a number to callback and a number to call from. A sample setup of that is shown here in a Studio flow where a number has been wired up to immediately create a callback and hang up.

![alt text](/img/f2/callback-and-voicemail/sample-triggering-callback.png)

Here you can see three parameters which are populated from the studio flow

- `numberToCall: {{trigger.call.From}}` - the number the customer dialed from
- `numberToCallFrom: {{trigger.call.To}}` - the number the customer tried to dial
- `flexFlowSid: {{flow.flow_sid}}` - to capture the entry point of this callback, it is stored on the task and is useful for debugging and tracking. (Optional - since this need not be invoked only from Studio)

This serverless function can be used from anywhere, not just the studio flow, to create a callback or voicemail task.

### Specifying the Workflow to Use

The creation of a task requires a workflow. You may create a custom workflow, that uses some collected data to organize the tasks into different queues or maybe something more complex. You may also just want to use the default "Assign To Anyone" workflow that is spawned on a vanilla flex instance.

Once you have decided which workflow you are using, you can either reference it in the environment file for your serverless-functions (`TWILIO_FLEX_CALLBACK_WORKFLOW_SID`), or you can explicitly provide a `workflowSid` in the call to the function. NOTE: The setup scripts will automatically set `TWILIO_FLEX_CALLBACK_WORKFLOW_SID` if it finds a workflow that has "Callback" in the name.

## Voicemail Additional Parameters

Creating a voicemail involves the same setup as the example above, however the following additional parameters must be passed to the _create-callback_ function from a Record Voicemail widget:

- `recordingSid: {{widgets.record_voicemail_1.RecordingSid}}` - the recording SID from the Record Voicemail widget
- `recordingUrl: {{widgets.record_voicemail_1.RecordingUrl}}` - the recording URL from the Record Voicemail widget

## Using Transcriptions in Voicemail Tasks

If you wish to enable transcriptions and show the transcription text on the voicemail task, you can invoke the create-callback function from the Transcription Callback URL on the Record Voicemail widget. Just be sure to include the required params in the URL. e.g.

`https://custom-flex-extensions-serverless-XXXX-dev.twil.io/features/callback-and-voicemail/studio/create-callback?numberToCall={{trigger.call.From | url_encode}}&numberToCallFrom={{trigger.call.To | url_encode}}&flexFlowSid={{flow.sid}}`

NOTE: `RecordingSid` and `RecordingUrl` are already part of the transcription callback event, along with `TranscriptionSid` and `TranscriptionText`. The use of the `url_encode` [Liquid Template Filter](https://www.twilio.com/docs/studio/user-guide/liquid-template-language#standard-filters) allows the leading '+' of the to/from phone numbers to be preserved.

If you do go with the transcription approach, the plugin will take care of rendering the transcription text below the playback controls for the recording - per the screenshot animation above.

## Requesting a Callback or Leaving a Voicemail While In Queue

The above steps assume there's logic in your IVR to allow a customer to request a callback and/or leave a voicemail.

If you also want to offer up a post-IVR "wait experience" to your customers - to allow them to request a callback or leave a voicemail while they are waiting in queue (i.e. while waiting for Taskrouter to route their call task to an agent), the template provides a boilerplate implementation of exactly this in the _wait-experience_ Serverless Function.

Simply set this function's URL as **_Hold Music URL_** in the Studio Send to Flex widget, or as the `waitUrl` if using the `<Enqueue>` TwiML verb. e.g.

`https://custom-flex-extensions-serverless-XXXX-dev.twil.io/features/callback-and-voicemail/studio/wait-experience?mode=initialize`

There is broad scope to customize the logic in here - potentially to pull more task attributes from the existing call task and apply them to the callback or voicemail task. Our default implementation keeps things simple and just retains the To and From numbers. For example, you may consider also retaining the workflow SID of the original call task, and some pertinent attributes from your IVR - to facilitate Taskrouter in routing those callback and voicemail tasks in an identical fashion to voice calls.

### Noteworthy Points Regarding the _wait-experience_ Logic

- **Creating a callback (or voicemail) via the _wait-experience_ logic will not specifically _retain_ your place in queue** - since we are literally creating a brand new task at this point (and that goes to the end of the line per the default first-in-first-out routing strategy).
- **We are able to set useful reporting attributes by programatically canceling the original call task when a customer chooses to request a callback (or leave a voicemail)** - rather than letting the task auto-cancel via native Taskrouter orchestration when the call ends. This includes a custom cancelation reason, as well as marking the task as `abandoned: "Follow-Up"` in the `conversations` attribute - which prevents Flex Insights from including this call in any Abandoned metrics (see [Track Abandoned Conversations in Flex Insights](https://www.twilio.com/docs/flex/end-user-guide/insights/abandoned-conversations#abandoned)).
- **Cancelling the ongoing call task programatically also prevents the call task reaching an agent when the customer has already committed to leaving a voicemail (or requesting a callback)**. We leave this task cancellation until the very last possible moment - to maximize the opportunity for an agent to answer.
- **It is essential to lookup and retain the task SID of the ongoing call task immediately - so that we can cancel it later and make changes to its reporting attributes as mentioned above.** Our implementation (see _getPendingTaskByCallSid()_) immediately retrieves the top 20 most recent `pending` or `reserved` (i.e. not-yet-accepted) tasks on the provided `workflowSid`, and finds the one with the matching `call_sid` attribute. Since this lookup occurs immediately on entering our configured `waitUrl` TwiML application - milliseconds after the associated task is created - this approach works very reliably and has been extensively load tested (100% success over a 1000 call test at a rate of 30 calls per second).
- **If for some reason the _wait-experience_ logic fails to find the task for the ongoing call's call SID, it will fail gracefully** by informing the customer that the callback and voicemail capability is currently unavailable.
- The bundled _wait-experience-music-30s.mp3_ file is an arbitrary 30s audio file used to ensure the caller is repeatedly prompted every ~30 seconds with the option to request a callback or leave a voicemail. You would want to customize this to meet your hold music needs.
