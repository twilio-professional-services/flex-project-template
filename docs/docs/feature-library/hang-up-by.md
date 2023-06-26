---
sidebar_label: hang-up-by
title: hang-up-by
---

This feature writes to the `conversations.hang_up_by` task attribute to allow reporting within Flex Insights on which party ended a call. This is accomplished by adding various Flex UI action and event listeners to deduce the reason for the conversation ending.

For external transfers, this also writes the `conversations.destination` task attribute to allow reporting on the phone numbers customers are being transferred to, available in Flex Insights under the `Destination` attribute.

The following values may be set for hang up by:

- Customer
- Agent
- Consult _(a consulting agent left the call before a warm transfer completed)_
- Cold Transfer
- Warm Transfer
- External Cold Transfer _(unused out-of-the-box, but available for customizations)_
- External Warm Transfer

This data is available in Flex Insights under the `Hang Up By` attribute.

# Setup and dependencies

Apart from enabling the `hang-up-by` feature, the task attributes set by this feature need to be initialized when tasks are created. For example, in a Studio flow `Send To Flex` widget, initialize the task attributes as follows:

```
{
  "conversations": {
    "hang_up_by": "Customer"
  }
}
```

This is important to enable accurate reporting when the customer abandons the call before an agent answers.

# How it works

Various action and event listeners are used to determine the party who ended the call. This value is kept in local storage until task wrap-up or task completion, when it is written to task attributes. Flex Insights reads task attributes at the time of reservation completion, and associates the task attributes to the correct reservation.
