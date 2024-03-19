---
sidebar_label: contacts
title: Contacts
---

## Overview

This feature adds a contacts directory to Flex. The contacts directory consists of recent contacts, personal contacts, and shared contacts.

- Recent contacts are populated based on completed voice and chat tasks, and allow for an agent to easily redial that contact. Recents are persisted for 14 days by default, and agents can choose to clear their recents.
- Personal contacts are contacts which are created by the worker, and are specific to that worker. The worker can add, modify, or delete any of their personal contacts.
- Shared contacts are contacts which are visible to all workers. By default, only workers with the admin or supervisor role can add, modify, or delete shared contacts. However, these can be optionally made editable for agents as well.

Contacts can be viewed, managed, and dialed using the contacts view added to Flex. In addition, a "Call Contact" section is added to the outbound dialer panel, allowing easy dialing of contacts from any view. Also, if the `custom-transfer-directory` feature is enabled, contacts are available in the transfer panel for cold or warm transfer.

## User experience

Recent contacts:
![Recent contacts screenshot](/img/features/contacts/recents.png)

Calling a contact:
![Placing call screenshot](/img/features/contacts/place-call.png)

Viewing contacts:
![Contacts directory screenshot](/img/features/contacts/contacts.png)

Editing contacts:
![Editing contact screenshot](/img/features/contacts/edit-contact.png)

## Configuration

The `contacts` feature has several settings:

- `enabled` - Set to `true` to enable the feature
- `enable_recents` - Set to `true` to enable the recent contacts functionality
- `enable_personal` - Set to `true` to enable the personal contacts directory
- `enable_shared` - Set to `true` to enable the shared contacts directory
- `recent_days_to_keep` - Number of days to retain recent contacts
- `shared_agent_editable` - Whether agents can edit the shared contacts directory
- `page_size` - Number of contacts to display per page

```json
"contacts": {
  "enabled": false,
  "enable_recents": true,
  "enable_personal": true,
  "enable_shared": true,
  "recent_days_to_keep": 14,
  "shared_agent_editable": false,
  "page_size": 10
}
```

## How does it work?

The contacts [view](https://www.twilio.com/docs/flex/developer/ui/custom-views-and-routes) is added to the [view collection](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/programmable-components/components/ViewCollection/) and a new SideLink component is added to the [navigation menu](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/programmable-components/components/SideNav/).

If the recent contacts functionality is enabled, for every task that is completed, the task and call data is added to the `Contacts_Recent_(worker SID)` Sync map. Clicking on the phone icon in the actions column for a recent contact triggers the [StartOutboundCall action](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/ui-actions/Actions/#StartOutboundCall) to make the outbound call. This button is only visible for completed calls (voice tasks).

The shared contacts directory is stored in a Sync map called `Contacts_(account SID)`. Personal contact directories are stored in a Sync map called `Contacts_(worker SID)`. The contents of these maps are added to Redux, and updates to them are automatically pushed into Redux as well. This allows other features, such as `custom-transfer-directory`, to easily tap in to the contacts directories.