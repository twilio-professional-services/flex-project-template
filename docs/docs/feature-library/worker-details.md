---
sidebar_label: worker-details
title: worker-details
---

# Overview
This feature adds a Tab to the the Worker Canvas (Agent Activity & Skills) in the Teams View to allow Supervisors to edit worker attributes like `team`, `department`, other custom text attributes and boolean (true/false) attributes or worker settings. These boolean attributes can be used to configure settings (or permissions) for the worker which could be leveraged to enable or disable certain custom features in the PS Template.

# How does it work?

The Supervisor can select a worker to view or edit from the Teams view. The Worker Canvas side panel displays the Worker Skills and possibly one or more other features related to the worker (for example Supervisor Capacity) in different tabs.  The Details tab shows the agent name and the attributes.  The list of available **Teams** and **Departments** is read from the common configuration in the Admin UI.

As noted in the [Flex insights docs](https://www.twilio.com/docs/flex/developer/insights/enhance-integration#enhance-agent-data)
  
- The `team_id` attribute is required to display `team_name`.
- The `department_id` attribute is required to display `department_name`.
  
Due to these dependencies, this feature will simply set both the `team_id` and `team_name` to the same value.
Similarly it will set `department_id` and `department_name` to the same value.

The `text_attributes` property can be used to specify an array of worker attributes that should be updated using a Text Input box.  For example, `text_attributes: ['location', 'manager']` provides two Text Input fields to allow supervisors to update these two worker attributes.

Use the `boolean_attributes` property to provide an array of boolean (true/false) attibutes which will be displayed as [Paste Switch components](https://paste.twilio.design/components/switch).  These settings can then be enabled or disabled for each worker. At this time, none of the other features in the PS Template leverage any custom worker settings yet, but with this new capability and a setting like `boolean_attributes: ['auto_accept]` you could enhance the [Agent Automation](agent-automation.md) feature to enable auto accept per worker. 

Saving changes to the worker details updates the Worker Attributes using a Twilio serverless function.

# Setup

This feature can be enabled via the `flex-config` attributes. Just set the `worker_details` `enabled` flag to `true` and set up the desired configuration. 

Use the `text_attributes` property to specify an array of editable text input fields.  

Use the `boolean_attrbutes` property to provide an array of boolean (true/false) attributes that can be enabled (or disabled) per worker.

```json
    "worker_details": {
        "enabled": false,
        "edit_team": true,
        "edit_department": true,
        "text_attributes": [],
        "boolean_attributes": []
      },
```

# Flex User Experience

![WorkerDetails](/img/features/worker-details/WorkerDetails.png)

