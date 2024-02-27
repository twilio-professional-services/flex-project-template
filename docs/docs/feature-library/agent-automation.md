---
sidebar_label: agent-automation
title: agent-automation
---

This feature provides auto select, auto accept and auto wrap-up behavior for agent tasks. Wrap-up behavior can be optionally configured to allow agents to request extended wrap-up. Tasks qualify for a configuration set based on their channel and a set of required task and/or worker attributes. The first configuration set to match is the configuration set used.

## known issues

As this is a front end implementation of operations, closing the browser will void the automated behavior. For this reason, it is advised to also use the `supervisor-complete-reservation` feature in unison with this one, which allows supervisors to force complete any reservations that have fallen into this state.

A preferred solution to auto wrap-up would require a backend handler to move the state of the task after the given timeout.

## flex-user-experience

An auto selected, auto accepted chat task with an auto wrap-up after 5 seconds, with the agent demonstrating the extended wrap-up option (set to extend by 10 seconds). This also demo also shows the `activity-reservation-handler` and `dispositions` features to demonstrate a more complete agent workflow.

![agent automation screen recording](/img/features/agent-automation/agent-automation.gif)

## setup and dependencies

There are no additional dependencies for setup beyond ensuring the flag is enabled within the `flex-config` attributes.

To enable the `Agent Automation` feature, under the `flex-config` attributes set the `agent_automation` `enabled` flag to `true` and set up the desired configuration set for qualifying tasks. `channel` is the TaskRouter channel name, `required_attributes` are key value pairs of attribute values that need to be present on the task to qualify for the configuration set, and `required_worker_attributes` are key value pairs of attribute values that need to be present on the worker to qualify. The first qualifying configuration set identified is used.

```json
"agent_automation": {
  "enabled": true,
  "configuration": [{
    "channel": "voice",
    "required_attributes": [{"key": "direction", "value": "inbound"}],
    "required_worker_attributes": [{"key": "team_name", "value": "Blue Team"}],
    "auto_accept": true,
    "auto_select": true,
    "auto_wrapup": true,
    "wrapup_time": 30000,
    "allow_extended_wrapup": true,
    "extended_wrapup_time": 0,
    "default_outcome": "Automatically completed"
  }]
},
```

## how does it work?

When enabled, this feature listens for taskReceived events and evaluates whether the tasks matches any configuration sets, and if so executes SelectTask & AcceptTask action as configured. This feature also loads a component on the task canvas at wrap-up. When the component mounts, if there is a matching task configuration then a timeout is set per the task configuration that triggers a CompleteTask action. In addition, the `TaskCanvasHeader` is modified to show the remaining wrap-up time instead of the elapsed time.

If both `auto_wrapup` and `allow_extended_wrapup` are set to `true`, agents will also have an "Extend Wrap Up" button available during wrap-up, which allows them to optionally extend the duration before auto-wrap-up is triggered. The duration of the extended wrap-up is configured by the `extended_wrapup_time` setting. If `extended_wrapup_time` is set to 0, then agents will have an infinite amount of extended wrap up time. Initiating extended wrap up invokes the `ExtendWrapUp` action, which can be used to add customizations such as setting task attributes. In addition, when extended wrap up is used in conjunction with the `activity-reservation-handler` feature, the agent's activity will be switched to the configured `extendedWrapup` activity during extended wrap up.

When used in combination with the `dispositions` feature's require disposition setting, that setting will take precedence and prevent auto-wrap-up of the affected task if no disposition is selected. If no disposition is required, the optional `default_outcome` setting allows you to configure the value displayed in Flex Insights for the outcome when the wrap-up time expires and there is no disposition selected by the agent via the `dispositions` feature (or it is disabled).
