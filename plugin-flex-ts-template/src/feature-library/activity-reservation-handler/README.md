<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# WIP: Activity Reservation Handler

This feature demonstrates how you can dynamically change worker activities over the course of a task, as well as having the ability to define activites that should not be manually selected and preventing the worker from changing their activity while they're on task.

---

## Overview

This plugin addresses a few common needs in many contact centers:

- Changing the worker's activity when they're handling tasks and when their tasks are in wrapup.
  - This makes it easier to monitor what workers are doing in realtime, and improves workforce management visibility in Flex Insights for historical reporting
- Ability to define activities that should not be manually selected, such as the activities used to indicate the worker is handling tasks or in wrapup
- Preventing the worker from changing their activity while they're on a task, delaying that activity change until after they've completed their tasks
  - Changing to another activity like "Break" while the agent is actively handling tasks can result in inaccurate activity based reporting. Preventing that change until they're actually complete with their tasks aids in reporting and monitoring accuracy.

---

## Remaining Development Tasks

Original Plugin Link -- [plugin-activity-handler](https://github.com/twilio-professional-services/plugin-activity-handler)

- **Redux State Management**
  - Currently, the redux state was ported over from the original plugin as-is, which sits in [`flex-hooks/states/FlexState.ts`](flex-hooks/states/FlexState.ts) and [`flex-hooks/states/WorkerState.ts`](flex-hooks/states/WorkerState.ts). The functionality needs to be augmented to fit the pattern of state management laid out in this template.
- **Reservation Listeners**
  - Currently, the bulk of the listeners are stored within [`utils/WorkerActivites.ts`](utils/WorkerActivites.ts), but need to be transformed into the `js-client-event-listeners` directory.
- **Updated Typings**
  - The `any` type was used as a temporary typing in a few locations, which needs to be updated to reflect the actual type
- **Activity Configuration Strategy**
  - Currently, the available activities are stored as an `enum` in [`utils/enums.ts`](utils/enums.ts), which should be re-worked to fit within the configuration objects located in the `flex-config` directory.

---

## Configuration

### TaskRouter Activities

This plugin is built to support the following activities for tracking if an agent has an assigned task:

- **On a Task** (`Available: true`)
  - This is an Available activity and is used after accepting an inbound task from the queue, or when an outbound call is placed while in an Available activity
  - Indicates the worker has at least one assigned task not in a `wrapping` state
- **Wrap Up** (`Available: true`)
  - This is an Available activity and is used when all assigned tasks are in a `wrapping` state
  - In the case of an outbound call task in `wrapping` state, this is used if the outbound call was placed while in an Available activity
- **On a Task, No ACD** (`Available: false`)
  - This is a non-Available activity and is used when an outbound call is placed while in a non-Available activity
  - Using a non-Available activity in this scenario ensures the worker doesn't receive any unexpected tasks from the queue when their activity is automatically changed
- **Wrap Up, No ACD** (`Available: false`)
  - This is a non-Available activity and is used when an outbound call that was placed while in a non-Available activity enters the `wrapping` state and the worker has no other non-wrapping assigned tasks
  - Using a non-Available activity in this scenario ensures the worker doesn't receive any unexpected tasks from the queue when their activity is automatically changed

If these activity names suit your requirements, you simply need to add them to your TaskRouter configuration in the Twilio Console -> TaskRouter -> [Workspace] -> Activities. Please pay attention to the `Available` boolean following each activity name above and use that same boolean value when creating the activity in the Twilio Console.

If you'd prefer to use different names for these activities, after creating the desired activities in the Twilio Console, you will need to change the activity string names referenced in the plugin [`utils/enums.ts`](utils/enums.ts) module, `Activity` object:

```
export const Activity = {
  available: 'Available',
  onATask: 'On a Task',
  onATaskNoAcd: 'On a Task, No ACD',
  wrapup: 'Wrap Up',
  wrapupNoAcd: 'Wrap Up, No ACD'
};
```

For example, if you wanted to use "On a Call" to indicate when the worker was on a task and "After Call Work" to indicate a worker's assigned tasks are in `wrapping`, and carry those same base values to the non-Available variants, your modified `Activity` object would look like:

```
export const Activity = {
  available: 'Available',
  onATask: 'On a Call',
  onATaskNoAcd: 'On a Call, No ACD',
  wrapup: 'After Call Work',
  wrapupNoAcd: 'After Call Work, No ACD'
};
```

If you are using your own activity names, please ensure the `Available` boolean values in the activity list at the start of this section are maintained. For example, "After Call Work" would still be `Available: true`, while "After Call Work, No ACD" would still be `Available: false`.
