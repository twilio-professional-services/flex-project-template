---
sidebar_label: dispositions
title: Dispositions / wrap-up codes
---

## Overview

Dispositions are useful for tracking the outcomes of various tasks. This feature allows you to provide a custom list of dispositions that agents may select before completing their task. Disposition selection may be optional or required, and dispositions may be global or queue-specific. You may also optionally enable a free-form notes field. Dispositions are available in Flex Insights under "Outcome", and notes are available under "Content". 

To capture additional data elements on this wrap-up form, you can configure a set of Text and Select attributes with labels and mappings to conversations attributes for reporting purposes.

## Flex User Experience

![Dispositions demo](/img/features/dispositions/dispositions.gif)

Extended Wrap-up form with additional fields.

![WrapUpForm](/img/features/dispositions/WrapUpForm.png)

## Setup and Dependencies

Within your `ui_attributes` file, there are several settings for the `dispositions` feature:

- `enable` - set this to true to enable the feature
- `enable_notes` - set this to true to enable a free-form notes field in addition to disposition selection
- `require_disposition` - set this to true to require the agent to select a disposition in order to complete the task

- `global` - this section contains the configuration that applies to all types of contacts (all queues)
  - `dispositions` - a string array of dispositions to list for tasks from any queue
  - `text_attributes` an array of additional Text fields that can be added to the wrap-up form.
  - `select_attributes` an array of additional wrap-up form elements that are rendered as a [Select dropdown](https://paste.twilio.design/components/select) with Options to allow the user to pick a value from a list.
  - `multi_select_group` a single object to render a Group of Checkboxes to allow for multi-select

- `per_queue` - allows you to set different configurations for tasks from the provided queue name(s)
  - `require_disposition` - require the agent to select a disposition to complete tasks from this queue.
  - `dispositions` - dispositions that are only listed for tasks from this queue.
  - `text_attributes` - additional Text Attributes only for this queue.
  - `select_attributes` - additional Select Attributes only for this queue.
  - `multi_select_group` an additional Group of [Checkboxes](https://paste.twilio.design/components/checkbox) to allow for selecting multiple values.

Each entry in a `text_attributes` array should have a `form_label` and [`conversation_attribute`](https://www.twilio.com/docs/flex/developer/insights/enhance-integration) to use for storing the data. The `required` property is optional. When provided with `required: true`, the Disposition form will enforce that the user enters a value.

```       {
            "form_label": "Case Number",
            "conversation_attribute": "case",
            "required": true
          }
```

 Each entry in the `select_attributes` array is rendered as a [Select dropdown](https://paste.twilio.design/components/select) with Options to allow the user to pick a value from a list. Entries in this array should have this format:
 ```
          {
            "form_label": "Topic",
            "conversation_attribute": "conversation_attribute_3",
            "options": ["New Order", "Cancel", "Update Order", "Warranty", "Inquiry"]
          },
          {
            "form_label": "New Customer",
            "conversation_attribute": "conversation_attribute_4",
            "options": ["Yes", "No"],
            "required": true
          }
```
When provided with `required: true`, the Disposition form will enforce that the user selects a value.

The `multi_select_group` item is a configuration object that can be used to render a Group of Checkboxes to allow for selecting multiple values. Checked values are concatenated into a pipe delimited string in the attributes ("Flex|Voice|Studio", for below example).
```
         {
          "form_label": "Twilio Products",
          "conversation_attribute": "conversation_attribute_2",
          "required": true,
          "options": ["Flex", "Studio", "Voice", "Chat", "SMS", "Functions"],
        },
```



### Notes ###

* If both global and per-queue `dispositions` are configured, the agent will be see a combined list.
* If present, the per-queue `require_disposition` setting will override the higher-level `require_dispositions` setting.
* If no dispositions are configured, and notes are not enabled, the dispositions tab will not be added.
* The `required` property is optional for the `text_attributes` and `select_attributes`. When provided with `required: true`, the Disposition form will enforce that the user enters or selects a value.
* You can use a Select Attribute with options Yes and No to implement a boolean type field.
* If you provide both a global `multi_select_group` and a `multi_select_group` per queue, both will be rendered on the form (if the queue name matches for the task).
* Once your updated flex-config is deployed, the feature is enabled and ready to use.

## How does it work?

This feature adds a disposition tab to `TaskCanvasTabs`. When the task enters the wrapping state, the disposition tab is automatically selected. The user's selected disposition and/or notes are stored in state. When the Complete Task button is pressed, the selected values are read from state and written to task attributes. The disposition is stored in the `conversations.outcome` attribute, and notes are stored in the `conversations.content` attribute.  Additional custom attributes are stored based on the configured [conversations attribute](https://www.twilio.com/docs/flex/developer/insights/enhance-integration) for each one.  In addition to `conversation_attribute_2` through 10, there are other pre-defined attributes available in the [Insights Data Model](https://www.twilio.com/docs/flex/end-user-guide/insights/data-model) such as `initiative`, `initiated_by` and `campaign` that can be leveraged to capture wrap-up data elements.


If `require_disposition` is enabled, and there are dispositions configured, the agent will not be allowed to complete the task until one is selected. When used in combination with the `agent-automation` feature's auto-wrap-up feature, the disposition requirement takes precedence and prevents auto-wrap-up.

