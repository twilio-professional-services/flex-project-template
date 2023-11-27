---
sidebar_label: supervisor-barge-coach
title: Supervisor Barge Coach Suite
---

This feature provides the ability for a Supervisor to barge in to a call (i.e. join an active call with an agent) or coach and agent (IE talk only to the agent where the caller(s) are unable to hear you), all from the Team's View.

There are addtiional features that have been added to allow the Agent to see who is actively coaching them along with giving the Supervisor the ability to go into a "private/incognito" mode if they wish to. The additional features require specific feature flags to be enabled, which we will review in the setup and dependencies section below.

## Flex User Experience

First select the call/worker you wish to monitor  
![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-1.gif)

Click the Monitor button to enable the Barge-In Button (Middle Button) and the Coach Button (Right Button)  
![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-2.gif)

Coach Status Panel to the Agent's UI. This UI change can be enabled/disabled by the below button
![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-3.gif)

There is a private toggle to enable/disable the agent's ability to see who is coaching them  
![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-4.gif)

There is also a Supervisor Monitor Panel, which gives the supervisors the ability to see if other supervisors are monitoring, coaching, or have joined (barged) the call. \*\*Note that the private toggle feature does apply to this feature as well. If a Supervisor has private mode on, they will not show up in the Supervisor Monitor Panel

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-5.gif)

We've also included Agent Assistance into this plugin suite. This adds a button to the agent's call canvas to ask for assistance.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-6.gif)

When the Agent clicks the Assistance button, Supervisors will be sent a notification with the agent seeking assistance. The notification bar is clickable and will navigate the Supervisor the Teams View if clicked.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-7.gif)

From the Teams View, Supervisors will notice an _Error_ icon next to any agent that is actively seeking assistance.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-8.gif)

\*\*Note that the supervisor alert toggle feature does apply to this feature as well. If a Supervisor has alerts toggled to enabled via the MainHeader button, they will receive a notification any time an agent asks for assistance. The notification bar is clickable and will navigate them to the Team's View. If a Supervisor has alerts disabled, it will suppress Agent Assistance specific notifications for them.

![Plugin Demo](/img/features/supervisor-barge-coach/Supervisor-Barge-Coach-Plugin-9.gif)

## Setup and Dependencies

There are no dependencies for setup beyond ensuring the flag is enabled within the flex-config attributes.

To enable the standard supervisor barge coach feature, under the flex-config attributes set the `supervisor_barge_coach` `enabled` flag to `true`.

To enable the Coach Status Panel and Private Toggle, set the `supervisor_barge_coach` `agent_coaching_panel` flag to `true`

To enable the Supervisor Monitor Panel, set the `supervisor_barge_coach` `supervisor_monitor_panel`flag to `true`

To enable the Agent Assistance, set the `supervisor_barge_coach` `agent_assistance`flag to `true`

To enable the Supervisor Alert Toggle, set the `supervisor_barge_coach` `supervisor_alert_toggle`flag to `true`

## Local Testing

To test this functionality locally, it is helpful to setup an [SSO configuration](https://www.twilio.com/docs/flex/admin-guide/setup/sso-configuration) to login as an `agent` role in one Flex session, and a `supervisor` or `admin` role in another tab/browser.

## How does it work?

This plugin adds a barge-in and coach button to the Monitor call canvas. You can get to this via the Teams View, click on the agent you wish to monitor and the buttons will be available once you begin to monitor the live calls. The left button is the Barge-In button which allows you to join the conference all with the agent(s) and customer(s). Toggling this button will mute/unmute yourself. The right button is the Coach button which allows you to talk to the agent you are monitoring. The no other member of the call will be able to hear you except for the monitored agent. Toggling this button enables Coach and the left button converts to a Mute/Un-Mute button for the coaching mode.

Some additional features have been added to give the ability for the agent to see who is coaching them, and the ability for the supervisor to get into a "private mode" if they wish to not be shown (this applies to both the agent coach panel and supervisor monitor panel features). The latest version has added the ability for Supervisors to see who may be actively monitoring, coaching, and have joined (barged) the call. See the # setup and dependancies section on enabling the additional features.

The latest feature, Agent Assistance has been added! This feature allows the agent on a Voice Task to ask for assistance. When the agent clicks the Assistance button (found within the Call Canvas UI), it will send a notification to all Supervisors with their name. The notification bar, if clicked, will navigate them to the Teams View. The Teams view will have an "error" icon next to any agent that is actively seeking assistance. There is a feature included (if enabled) that allows the Supervisor to suppress any Agent Assistance notifications for them.

Combining the Agent Assistance feature with Barge/Coach made the most sense as these two feature naturally benefit each other. In addition, having the Supervisor Monitor Panel and the Coaching Panel for the agents, allows for your organization to see who is actively engaged with an Agent, especially if they are seeking assistance.

---

## Changelog

### 2.0

**March 15 2023**

- Added the Agent Assistance Feature
- Refactored code with a few helper functions
- Enhanced the UI and browser refresh recovery

### 1.0

**Sept 16 2022**

- Upgraded Barge Coach to Flex 2.0!
