---
sidebar_label: worker-details
title: worker-details
---

# Overview
This feature adds a Tab to the the Worker Canvas (Agent Activity & Skills) in the Teams View to allow Supervisors to edit worker attributes like `team`, `department`, `location` and `manager`. You can select which fields are editable in the configuration for this feature.

# How does it work?

The Supervisor can select a worker to view or edit from the Teams view. The Worker Canvas side panel displays the Worker Skills and possibly one or more other features related to the worker in different tabs.  The Details tab shows the agent name and the attributes.  The list of available **Teams** and **Departments** is read from the common configuration in the Admin UI.

The **Manager Name** and **Location** fields are text input boxes without limitations.

**Unit Leader**, **Auto Accept** and **Auto Wrapup** are boolean attibutes that can be enabled or disabled for each worker.

Saving changes to the worker details updates the Worker Attributes using a Twilio serverless function.

# Setup

This feature can be enabled via the `flex-config` attributes. Just set the `worker-details` `enabled` flag to `true` and set up the desired configuration. Enable or disable editable fields as needed.

```json
    "worker_details": {
        "enabled": false,
        "edit_team": true,
        "edit_department": true,
        "edit_location": true,
        "edit_manager_name": false,
        "edit_unit_leader": true,
        "edit_auto_accept": true,
        "edit_auto_wraupup": true
      },
```

# Flex User Experience

![WorkerDetails](/img/features/worker-details/UpdateWorkerDetails.png)

