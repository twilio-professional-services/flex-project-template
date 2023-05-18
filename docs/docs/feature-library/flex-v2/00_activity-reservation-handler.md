---
sidebar_label: activity-reservation-handler
sidebar_position: 1
title: activity-reservation-handler
---

This feature demonstrates how you can dynamically change worker activities over the course of a task, as well as having the ability to define activites that should not be manually selected and preventing the worker from changing their activity while they're on task.

---

## Overview

This feature addresses a few common needs in many contact centers:

- Changing the worker's activity when they're handling tasks and when their tasks are in wrapup.
  - This makes it easier to monitor what workers are doing in realtime, and improves workforce management visibility in Flex Insights for historical reporting
- Ability to define activities that should not be manually selected, such as the activities used to indicate the worker is handling tasks or in wrapup
- Preventing the worker from changing their activity while they're on a task, delaying that activity change until after they've completed their tasks
  - Changing to another activity like "Break" while the agent is actively handling tasks can result in inaccurate activity based reporting. Preventing that change until they're actually complete with their tasks aids in reporting and monitoring accuracy.

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

If you'd prefer to use different names for these activities, after creating the desired activities in the Twilio Console, you will need to change the activity string names from confiuration.

This feature relies on custom configuration being applied to your underlying [Flex configuration](https://www.twilio.com/docs/flex/developer/ui/configuration#modifying-configuration-for-flextwiliocom). This is accomplished using the [Flex Configuration Updater](https://github.com/twilio-professional-services/twilio-proserv-flex-project-template/tree/main/flex-config) package in this repository.

In your `ui_attributes.{environment}.json` file, update "custom.data.features.activity_reservation_handler.system_activity_names" to a JSON object with the attributes available, onATask etc along with a string representing the name of the activity in the TaskRouter Workspace.

```
{
  available: 'Available',
  onATask: 'On a Task',
  onATaskNoAcd: 'On a Task, No ACD',
  wrapup: 'Wrap Up',
  wrapupNoAcd: 'Wrap Up, No ACD'
}
```

For example, if you wanted to use "On a Call" to indicate when the worker was on a task and "After Call Work" to indicate a worker's assigned tasks are in `wrapping`, and carry those same base values to the non-Available variants, your modified object would look like:

```
 {
  available: 'Available',
  onATask: 'On a Call',
  onATaskNoAcd: 'On a Call, No ACD',
  wrapup: 'After Call Work',
  wrapupNoAcd: 'After Call Work, No ACD'
}
```

If you are using your own activity names, please ensure the `Available` boolean values in the activity list at the start of this section are maintained. For example, "After Call Work" would still be `Available: true`, while "After Call Work, No ACD" would still be `Available: false`.

# flex-user-experience

This section provides visual examples of what to expect for each feature above.

### "On a Task" and "Wrap Up" Activity Change (Inbound Queue Call)

!["On a Task" and "Wrap Up" Activity Change, Inbound Queue Call](/img/f2/activity-reservation-handler/plugin-activity-handler-inbound-acd.gif)

### "On a Task, No ACD" and "Wrap Up, No ACD" Activity Change (Outbound Call from non-Available Activity)

!["On a Task, No ACD" and "Wrap Up, No ACD" Activity Change, Outbound Call from non-Available Activity](/img/f2/activity-reservation-handler/plugin-activity-handler-outbound-no-acd.gif)

### Preventing Selection of Restricted Activities

![Preventing Selection of Restricted Activities](/img/f2/activity-reservation-handler/plugin-activity-handler-restricted-activities.gif)

### Delaying Activity Change Until Tasks Are Completed

![Delaying Activity Change Until Tasks Are Completed](/img/f2/activity-reservation-handler/plugin-activity-handler-delayed-activity-change.gif)
