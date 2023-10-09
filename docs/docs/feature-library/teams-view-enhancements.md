---
sidebar_label: teams-view-enhancements
title: teams-view-enhancements
---

# Overview
 In Flex, Supervisors can monitory agent activity in the [Teams View](https://www.twilio.com/docs/flex/end-user-guide/insights/monitor-agent-activity). The Teams View displays the agent's status and the tasks they are working on. Supervisors can also listen to live calls and view the chat/messaging conversations. 

The Teams View can be modified by adding and removing columns in the [WorkersDataTable](https://www.twilio.com/docs/flex/developer/ui/components#add-columns-to-workersdatatable) to display some of the agent attributes or their skills.  The TaskCard component can be enhanced to show different information for each task or to change it's visual appearance.

# How does it work?

### Add Columns with Worker Attributes
The workers skills array can be re-formatted and shown in an additional column in the WorksDataTable of the Teams View.  This gives Supervisors a quicker way to review worker skills. Additionally, extra columns can be added to display worker attributes such as `team_name`, `department_name`, `location` or other custom attributes. It is highly recommended to configure these worker attributes via [Flex SSO](https://www.twilio.com/docs/flex/admin-guide/setup/sso-configuration#flex-insights)

### Highlight Tasks
We can highlight tasks that have a long handle time by adding a colored border around the Task Card based on the task age. For example, if the task is older than 3 minutes (180 seconds) we can show a yellow border. And if the task age exceeds 5 minutes (300 seconds) we can show red border. This task highlighting may assist supervisors with observing how agents are performing, or if they are having challenges completing tasks within expected handling time ranges.  

By default, the [SupervisorTaskCardHeader template string](https://www.twilio.com/docs/flex/developer/ui/v1/localization-and-templating#list-of-available-content-strings) displays the `{{task.defaultFrom}}` value which can be either the caller's phone number or the chat customer's name (identity).  This specific task detail may not be useful for Supervisors so we could change that template string to `{{task.queueName}}` to be able to see which queues the agent is working in. 

### Teams View Data Tiles
The Worker and Task data available in Redux for the Teams View can be aggregated by Team name attribute (if populated for all workers) and summarized in "Data Tiles" at the top of the page, similar to the Queues View.

The Task Summary table provides a breakdown of all active tasks by Channel (Voice, Chat, SMS) and agent team. For the Voice channel the active call count is split into Inbound and Outbound calls.

The Agent Activity Summary table shows the count of agents in each of the pre-configured activities (from the Enhanced Activity Tile in the Queues View configuration) by agent team.  Two additional columns are provided for Active Agents.  The "Idle" column shows the number of Available agents with No Tasks.  The "Busy" column shows the number of Available agents with at least one Task.

This feature uses the list of team names as configured within the [common configuration](/building/template-utilities/configuration#common-configuration), and the Activity configuration (colors and icons) from the Queues View Data Tiles.

# Setup

This feature can be enabled via the `flex-config` attributes. Just set the `teams_view_enhancements` `enabled` flag to `true` and set up the desired configuration.

In the list of `columns`, select which worker attributes to display in the WorkersTable.

To enable TaskCard highlighting based on the task age, set `highlight_handle_time: true` and specify the warning threshold (default 180 seconds) and "handle time exceeded" threshold (default 300 seconds).

To display the Task's Queue Name instead of the customer's phone number (or name), set the `display_task_queue_name: true`.

You can also enable the Task Summary tile to show a breakdown of the active tasks counts by Channel and Team. Select which channels to display by setting `taskCount: true`.  When enabling the Team Activity data tile, also configure the activity names to match the TaskRouter Activities in your workspace.

Note: The Teams View can only display up to 200 agents, so the worker data available for aggregation is limited to this data set.

```json
  "teams_view_enhancements": {
      "enabled": true,
      "channels": {
        "Voice": {
          "color": "#ADD8E6",
          "taskCount": true
        },
        "Chat": {
          "color": "#87CEFA",
          "taskCount": true
        },
        "SMS": {
          "color": "#59cef8",
          "taskCount": true
        },
        "Video": {
          "color": "#00CED1",
          "taskCount": true
        }
      },
      "task_summary": true,
      "team_activity": true,
      "idle_status_color": "limegreen",
      "busy_status_color": "royalblue",
      "highlight_handle_time": true,
      "handle_time_warning_threshold": 180,
      "handle_time_exceeded_threshold": 300,
      "display_task_queue_name": true,
      "columns": {
        "team": true,
        "department": false,
        "location": false,
        "agent_skills": true,
      }
    }
```

# Flex User Experience

![TeamsViewColumns](/img/features/teams-view-enhancements/teams-view-columns.png)

![TeamsViewTaskHighlight](/img/features/teams-view-enhancements/TeamsViewTaskHighlight.png)

When enabled, the Task Summary and Team Activity Tiles are added to the top of the Teams View.

![TaskSummaryActivityByTeam](/img/features/teams-view-enhancements/TeamsViewTaskAndActivitySummary.png)
