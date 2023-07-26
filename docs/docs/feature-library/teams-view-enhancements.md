---
sidebar_label: teams-view-enhancements
title: teams-view-enhancements
---

The Teams View can be modified by adding and removing columns in the [WorkersDataTable](https://www.twilio.com/docs/flex/developer/ui/components#add-columns-to-workersdatatable). 

# flex-user-experience

![TeamsViewColumns](/img/features/teams-view-enhancements/teams-view-columns.png)

The workers skills array can be re-formatted and shown in an additional column in the WorksDataTable of the Teams View.  This gives Supervisors a quicker way to review worker skills. Additionally, extra columns can be added to display worker attributes such as `team_name`, `department_name`, `location` or other custom attributes.

We can highlight tasks that have a long handle time by adding a colored border around the Task Card based on the task age. For example, if the task is older than 3 minutes (180 seconds) we can show a yellow border. And if the task age exceeds 5 minutes (300 seconds) we can show red border. These thresholds are configurable in the Admin panel. This task highlighting may assist supervisors with observing how agents are performing, or if they are having challenges completing tasks within expected handling time ranges.  