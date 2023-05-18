---
sidebar_label: dispositions
sidebar_position: 13
title: Dispositions / wrap-up codes
---

Dispositions are useful for tracking the outcomes of various tasks. This feature allows you to provide a custom list of dispositions that agents may select before completing their task. Disposition selection may be optional or required, and dispositions may be global or queue-specific. You may also optionally enable a free-form notes field.

Dispositions are available in Flex Insights under "Outcome", and notes are available under "Content".

# flex-user-experience

![Dispositions demo](/img/f2/dispositions/dispositions.gif)

# setup and dependencies

Within your `ui_attributes` file, there are several settings for the `dispositions` feature:

- `enable` - set this to true to enable the feature
- `enable_notes` - set this to true to enable a free-form notes field in addition to disposition selection
- `require_disposition` - set this to true to require the agent to select a disposition in order to complete the task
- `global_dispositions` - provide a string array of dispositions to list for tasks from any queue
- `per_queue` - allows you to set different configurations for tasks from the provided queue SID(s)
  - `require_disposition` - require the agent to select a disposition to complete tasks from this queue SID
  - `dispositions` - dispositions that are only listed for tasks from this queue SID

> **Note**
> If both global and per-queue dispositions are configured, the agent will be see a combined list.
> If present, the per-queue `require_disposition` setting will override the higher-level `require_dispositions` setting.

Once your updated flex-config is deployed, the feature is enabled and ready to use.

# how does it work?

This feature adds a disposition tab to `TaskCanvasTabs`. When the task enters the wrapping state, the disposition tab is automatically selected. The user's selected disposition and/or notes are stored in state. When the Complete Task button is pressed, the selected values are read from state and written to task attributes. The disposition is stored in the `conversations.outcome` attribute, and notes are stored in the `conversations.content` attribute.

If `require_disposition` is enabled, and there are dispositions configured, the agent will not be allowed to complete the task until one is selected. When used in combination with the `agent-automation` feature's auto-wrap-up feature, the disposition requirement takes precedence and prevents auto-wrap-up.

If no dispositions are configured, and notes are not enabled, the dispositions tab will not be added.
