# chat-transfer

This feature enables chat users to perform warm and cold transfers to individual agents or queues. It also introduces notifications into the chat channel for users joining or leaving chat, or starting a warm or cold transfer.

If using the notification feature it is advised that you copy the custom components over to the customer facing chat react app to be re-used, so the custom messages with message-attributes indicating a notification can be rendered the same as they will be in flex.

# flex-user-experience

An example using warm transfer

![alt text](screenshots/flex-user-experience-warm-transfer-full.gif)

# setup and dependencies

To use this feature first some setup needs to take place.

this feature creates a task when transfering which copies the attributes of the existing task and places them into the new task to be transfered. When we transfer we only know the target, a worker sid or a queue sid.

When creating a task we need to pass it to a taskrouter-workflow and the workflow needs to route it. In the case of a worker sid, this is a single rule as we can use the "known agent routing" option and pass in the variable. In the case of a queue, this is a little more cumbersome as we need to create a rule in the workflow for each queue.

So we need to setup a workflow, similar to this one [here](example-taskrouter-workflow.json) where the first rule matches any worker selected then we have a rule for each queue in the system.

With the workflow setup, we need to update the serverless function envionrment variable

> TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID

with the new workflow sid for the chat transfer.

# how does it work?

When enabled, the feature renders a "transfer" button at the top of the TaskCanvas.

When this button is selected, it invokes the [ShowDirectory](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/Actions.html#.ShowDirectory) action

When we select a worker or a queue, it invokes the [TransferTask](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/Actions.html#.TransferTask) action which is replaced with some custom logic that recognizes if the task is a chat task and performs our custom behaviors, otherwise, it does what it does OOTB.

The custom behaviors then handle the orchestration of creating a new task, posting notification messages (normal messages with message attributes that allow the message to be rendered as a notification instead of a conversational message). They also handle the management of the chatOrchestrator and the channel janitor.

# known issues

The channel is ended (marked INACTIVE) only by the last agent that received the transfer. That means if _Agent-A_ does a warm transfer to _Agent-B_ and _Agent-B_ completes the task, then it will end the chat for _Agent-A_ also. However if _Agent-A_ ends the chat first, _Agent-B_ can continue the conversation as normal.

If this is a problem, a solution lies in a [provided utility](../../../../serverless-functions/src/functions/features/chat-transfer/studio/add-task-to-chat-channel-data.protected.js) that can be called from the studio flow that creates the first task. After creating the task, you can pass the task Sid and channel sid to this serverless function and it will track the task sid on the channelAttributes. All subsequent task sids are also tracked as either being inflight or closed. This will allow a more robust logic being applied at wrap up to determin whether the task being wrapped up is the last task to wrap up or not but this will have to be implemented manually as the logic for this hasnt been created yet.
