---
sidebar_label: activity-reservation-handler
title: activity-reservation-handler
---

## Overview

This feature synchronizes the agent's [TaskRouter Activity](https://www.twilio.com/docs/taskrouter/api/activity) with the state of the tasks they are working on.


---

## Business Use Case

In many typical legacy contact centers there is a concept of an [Aux Code](https://cxcentral.com.au/glossary/auxiliary-codes/) which is used to track the reason that an agent is not recieving working from the Automatic Call Distributor (ACD). This Aux code includes explicitly distinguishing when an agent is on a live task and when an agent is in wrap up.

Twilio Task Router models things slightly differently. An agent's [Activity](https://www.twilio.com/docs/taskrouter/api/activity) is the concept in Task Router that manages availability for the agent to receive the next item of work.  This Activity status does not change throughout the life cycle of a task.  In Twilio Flex, reporting on an agents productivity is typically done via the examining the lifecycle of the tasks worked.

This paradigm shift can be a difficult one for legacy contact centers to adopt when migrating to Twilio Flex so this feature aims to make that easier by introducing a mechanism to automatically sync the agent Activity with the status of the work the agent is handling. This can aid with reporting strategies.

## Known Issues

### issue one
Flex places a limitation on changing Activity while a task is in a pending state.  In otherwords, if a task has been pushed to the agent but the agent has not accepted, then Flex can only change Activity to an offline Activity which will reject the task.

As a result, while a pending task appears in an agents task list, toggling between tasks will not update the Activity.  For this reason it is recommended to use this feature along with an [agent automation](/flex-project-template/feature-library/agent-automation) to auto accept tasks.

### issue two
Flex allows supervisors to move the Activity of an agent from the Supervisor Teams View.  Doing so pushes an Activity update to the worker which triggerrs the event `workerActivityUpdated` on the agents client which in turn triggers a re-evaluation of the correct state to be in, again on the client side.  This has two draw backs
1. The agent will be in the wrong state for a second
2. If the agents client is not running, there will be nothing to process the event and could end up in an erroneous state.

## Flex User Experience

!["Activity Reservation Handler"](/img/features/activity-reservation-handler/activty-reservation-handler.gif)

## Setup and Dependencies

This feature depends on the configured Activities for the different ACD states.  A terraform deploy will deploy the default Activites that are assigned. These can be changed through the admin panel at any time.

## Technical Details

### high level implementation
This feature initializes a helper class called `ActivityManager` which exposes a method called `updateState`.  This method evaluates the current tasks in flight to determine which, if any, system Activity the worker should be on.  If the worker should be moved into a new Activity, the method goes on to cache which Activity the worker is currently on in localStorage.

This method is triggered on `TaskAccepted` event as well as the various end state events for tasks, namely `TaskCanceled`, `TaskCompleted`, `TaskRejected`, `TaskRescinded`, `TaskTimeout` and `TaskWrapup`.  It is also triggered on `SelectTask` and `SetActivity`.

The `updateState` method uses a semaphore to ensure only one update is performed and completed at a time, completion includes the confirmation that the state has been updated which can wait up to a maxmimum of 3000ms to confirm the state upate before posting a warning and continuing.  Subsequent updates requested while the processs is running are added to an array and executed in order recieved.

It is due to this blocking operation that when starting an outbound call, an attempt to change the state when the task is pending can cause the outbound call to abandon.  This is why the `TaskReceived` event is ommitted from the events listed above.  Instead we use the `beforeStartOutboundCall` to move the agent into the appropriate activity first.

### sequence diagram

```mermaid
sequenceDiagram
    participant taskEvent(s)
    participant workerActivityUpdated
    participant afterSelectTask
    participant beforeStartOutboundCall
    taskEvent(s)->>ActivityManager: updateState()
    workerActivityUpdated->>ActivityManager: updateState()
    Note over ActivityManager: evaluateState()
    afterSelectTask->>ActivityManager: updateState()
    Note over ActivityManager: evaluateState()
    beforeStartOutboundCall->>ActivityManager: storePendingActivityChange()
    beforeStartOutboundCall->>ActivityManager: setWorkerActivity()
```





