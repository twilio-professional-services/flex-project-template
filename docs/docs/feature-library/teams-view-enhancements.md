---
sidebar_label: teams-view-enhancements
title: teams-view-enhancements
---

## Overview
 In Flex, Supervisors can monitory agent activity in the [Teams View](https://www.twilio.com/docs/flex/end-user-guide/insights/monitor-agent-activity). The Teams View displays the agent's status and the tasks they are working on. Supervisors can also listen to live calls and view the chat/messaging conversations. 

The Teams View can be modified by adding and removing columns in the [WorkersDataTable](https://www.twilio.com/docs/flex/developer/ui/components#add-columns-to-workersdatatable) to display some of the agent attributes or their skills.  The TaskCard component can be enhanced to show different information for each task or to change it's visual appearance.

## How does it work?

### Add Columns with Worker Attributes
The workers skills array can be re-formatted and shown in an additional column in the WorksDataTable of the Teams View.  This gives Supervisors a quicker way to review worker skills. Additionally, extra columns can be added to display worker attributes such as `team_name`, `department_name`, `location` or other custom attributes. It is highly recommended to configure these worker attributes via [Flex SSO](https://www.twilio.com/docs/flex/admin-guide/setup/sso-configuration#flex-insights)

### Highlight Tasks
We can highlight tasks that have a long handle time by adding a colored border around the Task Card based on the task age. For example, if the task is older than 3 minutes (180 seconds) we can show a yellow border. And if the task age exceeds 5 minutes (300 seconds) we can show red border. This task highlighting may assist supervisors with observing how agents are performing, or if they are having challenges completing tasks within expected handling time ranges.  

By default, the [SupervisorTaskCardHeader template string](https://www.twilio.com/docs/flex/developer/ui/v1/localization-and-templating#list-of-available-content-strings) displays the `{{task.defaultFrom}}` value which can be either the caller's phone number or the chat customer's name (identity).  This specific task detail may not be useful for Supervisors so we could change that template string to `{{task.queueName}}` to be able to see which queues the agent is working in. 

### Teams View Data Tiles
The Worker and Task data available in Redux for the Teams View can be aggregated by `team_name` attribute (if populated for all workers) and summarized in "Data Tiles" at the top of the page, similar to the Queues View.

These custom Teams View data tiles are part of the combined [Metrics Data Tiles feature](metrics-data-tiles.md) since many of the configuration settings are shared with the Queues View Data Tiles.

## Setup

This feature can be enabled via the `flex-config` attributes. Just set the `teams_view_enhancements` `enabled` flag to `true` and set up the desired configuration.

In the list of `columns`, select which worker attributes (team, department, location, agent_skills) to display in the WorkersTable.

By default the Teams View shows both the Calls and other Tasks for each worker.  For a voice-only Flex implementation, you can remove the Tasks column by setting `other_tasks = false`. Likewise for chat/messaging only Flex implementations, you could remove the Calls column.

The `activity_icon` column display an activity indicator for each agent using the same activity configuration (icons & colors) from the [Metrics Data Tiles](metrics-data-tiles.md).

To enable TaskCard highlighting based on the task age, set `highlight_handle_time: true` and specify the warning threshold (default 180 seconds) and "handle time exceeded" threshold (default 300 seconds).

To display the Task's Queue Name instead of the customer's phone number (or name), set the `display_task_queue_name: true`.

You can also enable the Task Summary tile to show a breakdown of the active tasks counts by Channel and Team. Select which channels to display by setting `taskCount: true`.  When enabling the Team Activity data tile, also configure the activity names to match the TaskRouter Activities in your workspace.

Note: The Teams View can only display up to 200 agents, so the worker data available for aggregation is limited to this data set.

```json
    "teams_view_enhancements": {
      "enabled": true,
      "highlight_handle_time": true,
      "handle_time_warning_threshold": 180,
      "handle_time_exceeded_threshold": 300,
      "display_task_queue_name": true,
      "columns": {
        "calls": true,
        "other_tasks": true,
        "team": true,
        "department": false,
        "location": false,
        "agent_skills": true,
        "activity_icon": true
      }
    }
```

## Flex User Experience

![TeamsViewColumns](/img/features/teams-view-enhancements/teams-view-columns.png)

![TeamsViewTaskHighlight](/img/features/teams-view-enhancements/TeamsViewTaskHighlight.png)

![AgentActivityIndicator](/img/features/teams-view-enhancements/AgentActivityIndicator.png)
