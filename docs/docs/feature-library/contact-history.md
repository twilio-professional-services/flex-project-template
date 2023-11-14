---
sidebar_label: contact-history
title: Contact History
---

## Overview

This feature adds a Contact History view to allow agents to see a list of their recent calls and chats. 

This feature adds a Contact History View to the Flex UI and allows agents to make outbound calls (click-to-dial) back to the customers. The recent contacts list is stored in the Redux state (and persisted in localStorage browser cache). The Max Number of Contacts retained is configurable and agents can clear their contact history by clicking the Clear History button. 

## flex-user-experience


## setup and dependencies

You can enable this feature and set the maximum number of recent contacts in the configuration as follows:

```json
"contact_history": {
    "enabled": true,
    "max_contacts": 25
}
```


