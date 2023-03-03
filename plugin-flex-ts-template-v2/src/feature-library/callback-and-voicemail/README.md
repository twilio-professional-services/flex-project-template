# Callbacks and Voicemail

This feature enables the creation of callbacks and voicemails as custom task types - by means of a Serverless Functions API. It also provides the UI to handle these special types of task in Flex - by means of Flex Plugin components. It is a generic reference implementation intended to be customized to meet the needs of any particular use case, and ultimately accelerate the development of callback and voicemail functionality - both on the the front end (Flex), and in the IVR (e.g. Studio).

The feature is inspired by the work in the [Queued Callback and Voicemail](https://www.twilio.com/docs/flex/solutions-library/queued-callback-and-voicemail) Twilio Solution Library, however it has a few key aspects that it improves upon:

- Callbacks and voicemails are placed on the 'voice' channel by default, as it's standard for such work to be threaded in single file with voice calls (i.e. an agent would not want to be handling any of these tasks concurrently with actual voice call tasks). NOTE: The Serverless Functions API we've exposed does allow the task channel to be overridden if desired.
- There is a Serverless Functions API for creating the callback or voicemail, so you just have to create your UX and then decide when and where to create the callback. No need to peel apart the sample solution for the task creation logic.
- [Creating a callback or voicemail](../../../../serverless-functions/src/functions/features/callback-and-voicemail/studio/create-callback.protected.js) has a little more resiliency built in as it uses a retry handler provided by our common wrappers provided by this template. Maximum retry attempts are configurable under this framework.
- Callbacks and voicemails use a shared set of components and functions, as voicemails are effectively callbacks with a voicemail recording (and possibly a transcription) attached.
- The callback or voicemail task can be automatically selected after the outbound call back to the contact ends, allowing for a smoother call wrapup process.
- _(COMING SOON)_ A more robust wait experience (aka `waitUrl` endpoint) is provided - which uses Call Annotations to store the pending task's Task SID against the call. This addresses the documented scalability issue of the solution library approach - which uses `EvaluateTaskAttributes` for getting the pending task SID (an API that's strictly rate limited to 3 requests per second).

# Flex User Experience

The vanilla feature without any further customizations will look like this for callbacks

![alt text](screenshots/flex-user-experience.gif)

Voicemails will look like this

![alt text](screenshots/flex-user-experience-vm.gif)

# Setup and Dependencies

Creating a callback involves creating a task with at a minimum a number to callback and a number to call from. A sample setup of that is shown here in a Studio flow where a number has been wired up to immediately create a callback and hang up.

![alt text](screenshots/sample-triggering-callback.png)

Here you can see three parameters which are populated from the studio flow

- `numberToCall: {{trigger.call.From}}` - the number the customer dialed from
- `numberToCallFrom: {{trigger.call.To}}` - the number the customer tried to dial
- `flexFlowSid: {{flow.flow_sid}}` - to capture the entry point of this callback, it is stored on the task and is useful for debugging and tracking. (Optional - since this need not be invoked only from Studio)

This serverless function can be used from anywhere, not just the studio flow, to create a callback task.

The creation of a task requires a workflow. You may create a custom workflow, that uses some collected data to organize the tasks into different queues or maybe something more complex. You may also just want to use the default "Assign To Anyone" workflow that is spawned on a vanilla flex instance.

Once you have decided which workflow you are using, you can either reference it in the environment file for your serverless-functions (`TWILIO_FLEX_CALLBACK_WORKFLOW_SID`), or you can explicitly provide a `workflowSid` in the call to the function.

Once you've set the flag for the feature in flex-config, and all of that is deployed, you now have a functioning callback feature!

Creating a voicemail involves the same setup as above, however the following additional parameters must be passed to the create-callback function from a Record Voicemail widget:

- `recordingSid: {{widgets.record_voicemail_1.RecordingSid}}` - the recording SID from the Record Voicemail widget
- `recordingUrl: {{widgets.record_voicemail_1.RecordingUrl}}` - the recording URL from the Record Voicemail widget

Alternatively, if you wish to enable transcriptions and show the transcription text on the voicemail task, you can invoke the create-callback functon from the Transcription Callback URL on the Record Voicemail widget. Just be sure to include the required params in the URL. e.g.

`https://custom-flex-extensions-serverless-XXXX-dev.twil.io/features/callback-and-voicemail/studio/create-callback?numberToCall={{trigger.call.From}}&numberToCallFrom={{trigger.call.To}}&flexFlowSid={{flow.sid}}`

(`RecordingSid` and `RecordingUrl` are already part of the transcription callback event)

# How Does it Work?

The feature works by registering custom Flex Channels for callbacks and voicemails. These channels are a presentation only layer, on top of the Taskrouter Task Channel, which remains 'voice'.

When the channel is registered, it renders custom components based on the task attribute; _taskType: callback_ or _taskType: voicemail_

There are two associated serverless functions called _create-callback_

The only difference between these functions is one is intended to be called from Flex, the other from anywhere else, but typically Studio (could also be from a TwiML app). The difference is the security model for each function but both do the same thing, taking in task attributes and generating a new callback (or voicemail) task (via a common utility). The Flex interface is used for the re-queueing feature.

# Requesting a Callback or Leaving a Voicemail While In Queue

:warning: **_Please be aware of the scalability limitation and recommendation below_**

If you also want to offer up a "wait experience" to your customers while they are waiting in queue (i.e. waiting for Taskrouter to route their call task to an agent), the template provides this in the _wait-experience_ Serverless Function.

Simply set this function's URL as Hold Music URL in the Studio Send to Flex widget, or as the `waitUrl` if using the <Enqueue> TwiML verb. Again, there is broad scope to customize the logic in here - potentially to pull more task attributes from the pending task and apply them to the callback or voicemail task. Our default implementation keeps things simple and just retains the To and From numbers. You may consider also retaining the workflow SID of the original pending task, and some pertinent attributes from your IVR - to facilitate Taskrouter in routing those callback and voicemail tasks in an identical fashion to voice calls.

## Scalability Limitation

The lookup mechanism used by the _wait-experience_ Serverless Function - for obtaining the Task SID associated with the current Call SID (see _getTaskByCallSid()_) is not to be used in a production environment due to potential scalabilty issues. The way our current solution does it - is by using the [Task List API](https://www.twilio.com/docs/taskrouter/api/task#read-multiple-task-resources) with the `EvaluateTaskAttributes` parameter (passing in the current Call SID as the attribute to match on). This usage of `EvaluateTaskAttributes` is _strictly rate limited to 3 requests per second_, and so should be avoided in any solution of any significant scale.

This approach is only used in our template solution purely to keep everything in the Twilio ecosystem and facilitate fast-tracking our customers to implementing a callback or voicemail wait experience. In a real world solution you would want to retain this mapping of Call SIDs to Task SIDs in your own database - and perform such lookups against that database - rather than using `EvaluateTaskAttributes` with Taskrouter's REST API.

## Other Noteworthy Points

- Creating a callback (or voicemail) while already waiting in queue will not specifically _retain_ your place in queue - since we are literally creating a brand new task at this point (and that goes to the end of the line per the default first-in-first-out routing strategy).
- By programatically canceling the original call task when a customer chooses to leave a voicemail - rather than letting the task auto-cancel via native Taskrouter orchestration when the call ends - this allows us to set some useful reporting attributes on the task. This includes a custom cancelation reason, as well as marking the task as `abandoned: "Follow-Up"` in the `conversations` attribute (which prevents Flex Insights from including this call in any Abandoned metrics). Cancelling the task programatically also prevents the call task reaching an agent when the customer has already committed to leaving a voicemail or requesting a callback.
