---
sidebar_label: dispositions
title: Dispositions / wrap-up codes
---

## Overview

Dispositions are useful for tracking the outcomes of various tasks. This feature allows you to provide a custom list of dispositions that agents may select before completing their task. Disposition selection may be optional or required, and dispositions may be global or queue-specific. You may also optionally enable a free-form notes field. Dispositions are available in Flex Insights under "Outcome", and notes are available under "Content". 

To capture additional data elements on this wrap-up form, you may also configure a set of text and/or selection attributes with labels and mappings to save to conversations attributes for reporting purposes.

## Flex User Experience

![Dispositions demo](/img/features/dispositions/dispositions.gif)

Extended wrap-up form with additional fields:

![WrapUpForm](/img/features/dispositions/WrapUpForm.png)

## Setup and Dependencies

Within your `ui_attributes` file, there are several settings for the `dispositions` feature:

- `enabled` - set this to true to enable the feature
- `enable_notes` - set this to true to enable a free-form notes field in addition to disposition selection

- `global` - this section contains the configuration that applies to all types of contacts (all queues)
  - `require_disposition` - set this to true to require the agent to select a disposition in order to complete the task
  - `dispositions` - a string array of dispositions to list for tasks from any queue
  - `text_attributes` - an array of additional text fields that can be added to the wrap-up form.
  - `select_attributes` - an array of additional wrap-up form elements that are rendered as a [select dropdown](https://paste.twilio.design/components/select) or group of [checkboxes](https://paste.twilio.design/components/checkbox) allowing the user to select one or many items, depending on settings.

- `per_queue` - allows you to set different configurations for tasks from the provided queue name(s)
  - `require_disposition` - require the agent to select a disposition to complete tasks from this queue.
  - `dispositions` - dispositions that are only listed for tasks from this queue.
  - `text_attributes` - additional text attributes only for this queue.
  - `select_attributes` - additional select attributes only for this queue.

Each entry in a `text_attributes` array should have the below format, including a `form_label` and [`conversation_attribute`](https://www.twilio.com/docs/flex/developer/insights/enhance-integration) to use for storing the data. The `required` property is optional. When provided with `required: true`, the disposition form will enforce that the user enters a value.

```
{
  "form_label": "Case Number",
  "conversation_attribute": "case",
  "required": true
}
```

 Each entry in the `select_attributes` array is rendered as a [select dropdown](https://paste.twilio.design/components/select) or a group of [checkboxes](https://paste.twilio.design/components/checkbox) to allow the user to pick value(s) from a list. Entries in this array should have this format:
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
},
{
  "form_label": "Twilio Products",
  "conversation_attribute": "conversation_attribute_2",
  "options": ["Flex", "Studio", "Voice", "Chat", "SMS", "Functions"],
  "required": true,
  "multi_select": true
}
```
When provided with `required: true`, the disposition form will enforce that the user selects a value.

When provided with `multi_select: true`, the options will be rendered as checkboxes, to allow multiple selections. Checked values are concatenated into a pipe delimited string in the attributes ("Flex|Voice|Studio", for the above example). This means that you should not include pipes within the configured `options`.

### Notes ###

* If both global and per-queue `dispositions` are configured, the agent will be see a combined list.
* If present, the per-queue `require_disposition` setting will override the higher-level `require_dispositions` setting.
* If no dispositions are configured, and notes are not enabled, the dispositions tab will not be added.
* The `required` property is optional for the `text_attributes` and `select_attributes`. When provided with `required: true`, the disposition form will enforce that the user enters or selects a value.
* You can use a Select Attribute with options Yes and No to implement a boolean type field.
* Once your updated flex-config is deployed, the feature is enabled and ready to use.

## How does it work?

This feature adds a disposition tab to `TaskCanvasTabs`. When the task enters the wrapping state, the disposition tab is automatically selected. The user's selected disposition and/or notes are stored in state. When the Complete Task button is pressed, the selected values are read from state and written to task attributes. The disposition is stored in the `conversations.outcome` attribute, and notes are stored in the `conversations.content` attribute.  Additional custom attributes are stored based on the configured [conversations attribute](https://www.twilio.com/docs/flex/developer/insights/enhance-integration) for each one.  In addition to `conversation_attribute_2` through 10, there are other pre-defined attributes available in the [Insights Data Model](https://www.twilio.com/docs/flex/end-user-guide/insights/data-model) such as `initiative`, `initiated_by` and `campaign` that can be leveraged to capture wrap-up data elements.

If `require_disposition` is enabled, and there are dispositions configured, the agent will not be allowed to complete the task until one is selected. When used in combination with the `agent-automation` feature's auto-wrap-up feature, the disposition requirement takes precedence and prevents auto-wrap-up.

