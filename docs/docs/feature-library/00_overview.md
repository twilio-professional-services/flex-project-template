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

| Feature                         | Description                                                                 | Feature Docs Page                                                                           |
| ------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Admin UI                        | _adds a feature settings view to Flex for customizing the template_ <br/><br/> **note by default this is disabled locally as this feature is only intended for hosted flex.*       | [admin-ui](/feature-library/admin-ui)                                               |
| Agent Automation                | _adds auto accept and auto wrapup behaviors to agent desktop_               | [agent-automation](/feature-library/agent-automation)                               |
| Attribute Viewer                | _easily view task and worker attributes within Flex_                        | [attribute-viewer](/feature-library/attribute-viewer)                               |
| Canned Responses               | _provide agents with pre-canned chat responses_                                                     | [canned-responses](/feature-library/canned-responses)                                 |
| Callbacks and Voicemail         | _introduce support for callback and voicemail tasks_                        | [callback-and-voicemail](/feature-library/callback-and-voicemail)                   |
| Caller ID                       | _provide agents with means to select their caller id when dialing out_      | [caller-id](/feature-library/caller-id)                                             |
| Conference (external)           | _provide agents the ability to conference in external numbers_              | [conference](/feature-library/conference)                                           |
| Conversation Transfer          | _introduce conversation-based messaging transfer functionality for agents_                          | [conversation-transfer](/feature-library/conversation-transfer)                       |
| Custom Transfer Directory       | _customize the agent and queue transfer directories_                        | [custom-transfer-directory](/feature-library/custom-transfer-directory)             |
| Device Manager                  | _provide agents the ability to select the audio output device_              | [device-manager](/feature-library/device-manager)                                   |
| Dispositions                   | _provide agents the ability to select a disposition/wrap-up code and enter notes_                   | [dispositions](/feature-library/dispositions)                                         | ✅                |
| Emoji Picker                    | _adds an emoji picker for messaging tasks_                                  | [emoji-picker](/feature-library/emoji-picker)                                       |
| Enhanced CRM Container         | _optimize the CRM container experience_                                                             | [enhanced-crm-container](/feature-library/enhanced-crm-container)                     | ✅                |
| Hang Up By Reporting           | _populates the Hang Up By and Destination attributes in Flex Insights_                              |     [hang-up-by](/feature-library/hang-up-by)                                             |
| Internal Call (Agent to Agent) | _provide agents the ability to dial each other_                                                     | [internal-call](/feature-library/internal-call)                                       |
| Park interaction               | _provide agents the ability to park interactions, preserving conversation history_                  | [park-interaction](/feature-library/park-interaction)                                 |
| Pause Recording                 | _provide agents the ability to temporarily pause and resume call recording_ | [pause-recording](/feature-library/pause-recording)                                 |
| Queues View Data Tiles          | _add Custom Data Tiles with real-time channel metrics (Task Counts, SLA%)_ | [queues-view-data-tiles](/feature-library/queues-view-data-tiles)           |
| Schedule Manager               | _a flexible, robust, and scalable way to manage open and closed hours for Twilio Flex applications_ | [schedule-manager](/feature-library/schedule-manager)                                 |✅                    |
| Scrollable Activities           | _allow the scrolling of the activities list_                                | [scrollable-activities](/feature-library/scrollable-activities)                     |
| Supervisor Barge Coach          | _introduce advanced supervisor barge and coach features_                    | [supervisor-barge-coach](/feature-library/supervisor-barge-coach)                   |
| Supervisor Capacity             | _allow supervisors to update worker capacity configuration within Flex_     | [supervisor-capacity](/feature-library/supervisor-capacity)                         |
| Supervisor Complete Reservation | _allows supervisor to remotely complete agent tasks_                        | [supervisor-complete-reservation](/feature-library/supervisor-complete-reservation) |
| Teams View Filters              | _adds additional filtering options to the supervisor teams view_            | [teams-view-filters](/feature-library/teams-view-filters)                           |
| Teams View Enhancements         | _adds optional columns (Team, Dept, Location, Skills) to the Workers Table. <br/> enable task highlighting based on task age_             | [teams-view-enhancements](/feature-library/teams-view-enhancements)                           |

---

</TabItem>
<TabItem value="additional" label="Additional features">

| Feature                        | Description                                                                                         | Feature Docs Page                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Activity Reservation Handler   | _synchronize agent activities to reservation states_                                                | [activity-reservation-handler](/feature-library/activity-reservation-handler)         |
| Activity Skill Filter          | _manage visibility for activities based on agent skills_                                            | [activity-skill-filter](/feature-library/activity-skill-filter)                       |
| Chat Transfer                  | _introduce programmable chat transfer functionality for agents_                                     | [chat-transfer](/feature-library/chat-transfer)                                       |
| Custom Hold Music              | _customize the experience when an agent places a call on hold_                                      | [custom-hold-music](/feature-library/custom-hold-music)                               |
| Dual Channel Recording         | _automatically record both inbound and outbound calls in dual channel_                              | [dual-channel-recording](/feature-library/dual-channel-recording)                     |
| Localization                   | _adds the ability to view Flex in a different language_                                             | [localization](/feature-library/localization)                                       |
| Omni Channel Management        | _method for mixing chat and voice channels_                                                         | [omni-channel-capacity-management](/feature-library/omni-channel-capacity-management) |

</TabItem>
<TabItem value="experimental" label="Experimental features">

:::caution Caution

These features will require modification for usage in a production setting. They are intended to serve as starting points or examples to jump-start your use case.

::: 

| Feature                        | Description                                                                                         | Feature Docs Page                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Chat to Video Escalation       | _provide agents ability to elevate a chat conversation to a video conversation with screen sharing_ | [chat-to-video-escalation](/feature-library/chat-to-video-escalation)                 |
| Multi-call                     | _allow agents to receive a transferred call while already on a call_                                | [multi-call](/feature-library/multi-call)                                             |

</TabItem>
</Tabs>
