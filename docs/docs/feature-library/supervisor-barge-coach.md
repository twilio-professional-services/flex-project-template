---
sidebar_label: supervisor-barge-coach
title: Supervisor Barge Coach Suite
---
import PluginLibraryFeature from "./_plugin-library-feature.md";

<PluginLibraryFeature />

This feature provides the ability for a supervisor to barge in to a call (i.e. join an active call with an agent) or coach an agent (i.e. talk only to the agent so the caller(s) are unable to hear you), all from the Teams view.

There are additional features that have been added to allow the agent to see who is actively coaching them, along with giving the supervisor the ability to go into a "private" mode if they wish to. The additional features require specific feature flags to be enabled, which we will review in the setup and dependencies section below.

## Flex User Experience

First, select the call/worker you wish to monitor:

![Selecting a worker](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-1.gif)

Click the monitor button to enable the barge and coach buttons:

![Monitor, barge, coach demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-2.gif)

The agent will see the supervisor currently coaching them when the supervisor hasn't enabled privacy mode:

![Agent coaching UI](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-3.png)

There is a privacy toggle to enable/disable the agent's ability to see who is coaching them:

![Privacy mode demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-4.gif)

There is also a supervisor monitor panel, which gives the supervisors the ability to see if other supervisors are monitoring, coaching, or have joined (barged) the call. If a supervisor has privacy mode on, they will not show up in the list.

![Monitor panel demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-5.gif)

We've also included Agent Assistance into this plugin suite. This adds a button to the agent's call canvas to ask for assistance.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-6.gif)

When the agent clicks the assistance button, supervisors will be sent a notification with the agent seeking assistance. The notification bar is clickable and will navigate the supervisor the Teams view if clicked. There is also an option to go directly to the associated task, assuming the worker is not currently filtered out of the Teams view.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-7.gif)

From the Teams view, supervisors will notice an _alert_ icon next to any agent that is actively seeking assistance. Clicking this icon allows the supervisor to clear the request after it has been handled.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-8.gif)

If the supervisor alert toggle option is enabled, the supervisor can enable or disable receiving assistance alerts via a _help_ button in the main header. If a supervisor has alerts toggled to enabled via this button, they will receive a notification any time an agent asks for assistance. If a supervisor has alerts disabled, it will suppress Agent Assistance specific notifications for them.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-9.gif)

## Setup and Dependencies

There are no dependencies for setup beyond ensuring the flag is enabled within the flex-config attributes.

To enable the standard supervisor barge coach feature, under the flex-config attributes set the `supervisor_barge_coach` `enabled` flag to `true`.

To enable the Coach Status Panel and Private Toggle, set the `supervisor_barge_coach` `agent_coaching_panel` flag to `true`

To enable the Supervisor Monitor Panel, set the `supervisor_barge_coach` `supervisor_monitor_panel` flag to `true`

To enable the Agent Assistance, set the `supervisor_barge_coach` `agent_assistance` flag to `true`

To enable the Supervisor Alert Toggle, set the `supervisor_barge_coach` `supervisor_alert_toggle` flag to `true`

## Local Testing

To test this functionality locally, it is helpful to setup an [SSO configuration](https://www.twilio.com/docs/flex/admin-guide/setup/sso-configuration) to login as an `agent` role in one Flex session, and a `supervisor` or `admin` role in another tab/browser.

## How does it work?

This plugin adds a barge-in and a coach button to the supervisor monitoring call canvas. You can get to this via the Teams View--click on the agent you wish to monitor and the buttons will be available once you begin to monitor the live calls. The barge button allows you to join the conference all with the agent(s) and customer(s). The coach button allows you to talk to only the agent you are monitoring. No other member of the call will be able to hear you except for the monitored agent.

Some additional features have been added to give the ability for the agent to see who is coaching them, and the ability for the supervisor to get into a "private mode" if they wish to not be shown (this applies to both the agent coach panel and supervisor monitor panel features). If the supervisor monitor panel is enabled, supervisors can see who may be actively monitoring, coaching, or have joined (barged) the call.

The agent assistance feature allows an agent on a voice task to ask a supervisor for assistance. When the agent clicks the assistance button (found within their call interface), it will send a notification, including the agent's name, to all supervisors. The notification bar, if clicked, will navigate them to the Teams view. The Teams view will have an "alert" icon next to any agent that is actively seeking assistance, which can be clicked to clear the request. If the supervisor alert toggle is enabled, supervisors will have a button allowing them to suppress any agent assistance notifications for them.

Combining the agent assistance feature with barge/coach made the most sense as these two features naturally benefit each other. In addition, having the supervisor monitor panel and the coaching panel for the agents allows for your organization to see who is actively engaged with an agent, especially if they are seeking assistance.
