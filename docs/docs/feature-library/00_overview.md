---
sidebar_label: Overview
sidebar_position: 0
title: Feature Overview
hide_table_of_contents: true
---
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

The **Flex Project Template** comes with a set of features enabled by default within the Flex configuration, along with additional features that can be enabled.

<Tabs queryString="type">
<TabItem value="default" label="Enabled by default" default>

| Feature                         | Description                                                                 |
| ------------------------------- | --------------------------------------------------------------------------- |
| [Admin UI](admin-ui)                        | _adds a feature settings view to Flex for customizing the template_ <br/> **note by default this is disabled locally as this feature is only intended for hosted Flex.*       |
| [Agent Automation](agent-automation)                | _adds auto accept and auto wrapup behaviors to agent desktop_               |
| [Attribute Viewer](attribute-viewer)                | _easily view task and worker attributes within Flex_                        |
| [Canned Responses](canned-responses)               | _provide agents with pre-canned chat responses_                                                     |
| [Callbacks and Voicemail](callback-and-voicemail)         | _introduce support for callback and voicemail tasks_                        |
| [Caller ID](caller-id)                       | _provide agents with means to select their caller id when dialing out_      |
| [Conference (external)](conference)           | _provide agents the ability to conference in external numbers_              |
| [Contacts](contacts)                  | _adds contact directories and provides a list of recent contacts_                                     |
| [Conversation Transfer](conversation-transfer)          | _introduce conversation-based messaging transfer functionality for agents_                          |
| [Custom Transfer Directory](custom-transfer-directory)       | _customize the agent and queue transfer directories_                        |
| [Datadog Log Integration](datadog-log-integration) | _forward logs emitted by the template to datadog_|
| [Dispositions](dispositions)                   | _provide agents the ability to select a disposition/wrap-up code and enter notes_                   |
| [Emoji Picker](emoji-picker)                    | _adds an emoji picker for messaging tasks_                                  |
| [Enhanced CRM Container](enhanced-crm-container)         | _optimize the CRM container experience_                                                             |
| [Hang Up By Reporting](hang-up-by)           | _populates the Hang Up By and Destination attributes in Flex Insights_                              |
| [Inline Media](inline-media) | _render chat message attachments inline_                                                     |
| [Internal Call (Agent to Agent)](internal-call) | _provide agents the ability to dial each other_                                                     |
| [Keyboard Shortcuts](keyboard-shortcuts) | _configure default and custom keyboard shortcuts for Flex_                                                     |
| [Park interaction](park-interaction)               | _provide agents the ability to park interactions, preserving conversation history_                  |
| [Pause Recording](pause-recording)                 | _provide agents the ability to temporarily pause and resume call recording_ |
| [Schedule Manager](schedule-manager)               | _a flexible, robust, and scalable way to manage open and closed hours for Twilio Flex applications_ |
| [Scrollable Activities](scrollable-activities)           | _allow the scrolling of the activities list_                                |
| [Supervisor Barge & Coach](supervisor-barge-coach)          | _introduce advanced supervisor barge and coach features_                    |
| [Supervisor Capacity](supervisor-capacity)             | _allow supervisors to update worker capacity configuration within Flex_     |
| [Supervisor Complete Reservation](supervisor-complete-reservation) | _allows supervisor to remotely complete agent tasks_                        |
| [Teams View Enhancements](teams-view-enhancements)         | _adds optional columns (Team, Dept, Location, Skills) to the Workers Table. <br/> enable task highlighting based on task age_             |
| [Teams View Filters](teams-view-filters)              | _adds additional filtering options to the supervisor teams view_            |
| [Worker Canvas Tabs](worker-canvas-tabs)                    | _consolidates the worker canvas sections into tabs_     |
| [Worker Details](worker-details)                    | _view or update worker attributes_     |

---

</TabItem>
<TabItem value="additional" label="Additional features">

| Feature                        | Description                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| [Activity Reservation Handler](activity-reservation-handler)   | _synchronize agent activities to reservation states_                                                |
| [Activity Skill Filter](activity-skill-filter)          | _manage visibility for activities based on agent skills_                                            |
| [Branding](branding)                  | _customize the Flex interface for your brand_                                     |
| [Chat Transfer](chat-transfer)                  | _introduce programmable chat transfer functionality for agents_                                     |
| [Custom Hold Music](custom-hold-music)              | _customize the experience when an agent places a call on hold_                                      |
| [Device Manager](device-manager)                  | _provide agents the ability to select the audio output device_              |
| [Dual Channel Recording](dual-channel-recording)         | _automatically record both inbound and outbound calls in dual channel_                              |
| [Localization](localization)                   | _adds the ability to view Flex in a different language_                                             |
| [Metrics Data Tiles](metrics-data-tiles)          | _add custom Data Tiles with real-time channel metrics (Task Counts, SLA%) to the Queues View.  <br/> add custom Task and Activity Summary by team tiles to the Teams View_ |
| [Omni Channel Management](omni-channel-capacity-management)        | _method for mixing chat and voice channels_                                                         |
| [Queues Stats Metrics](queues-stats-metrics)          | _add custom metrics columns to the Queues View_ |
| [Ring Notification](ring-notification)                    | _plays a ringtone sound for incoming tasks_                                     |
| [SIP Support](sip-support)                    | _adds call control functionality when using a non-WebRTC phone_                                     |

</TabItem>
<TabItem value="experimental" label="Experimental features">

:::caution Caution

These features will require modification for usage in a production setting. They are intended to serve as starting points or examples to jump-start your use case.

::: 

| Feature                        | Description                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| [Chat-to-Video Escalation](chat-to-video-escalation)       | _provide agents ability to elevate a chat conversation to a video conversation with screen sharing_ |
| [Multi-call](multi-call)                     | _allow agents to receive a transferred call while already on a call_                                |

</TabItem>
</Tabs>
