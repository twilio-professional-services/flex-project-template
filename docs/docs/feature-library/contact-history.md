---
sidebar_label: contact-history
title: Contact History
---

## Overview

This feature adds a Contact History [View](https://www.twilio.com/docs/flex/developer/ui/custom-views-and-routes) to the Flex UI and allows agents to make outbound calls (click-to-dial) back to the customers. The recent contacts list is stored in the Redux state (and persisted in localStorage browser cache). The Max Number of Contacts retained is configurable and agents can clear their contact history by clicking the Clear History button. 

## flex-user-experience

![ContactHistoryView](/img/features/contact-history/contact-history-view.png)

## setup and dependencies

You can enable this feature and set the maximum number of recent contacts in the configuration as follows:

```json
"contact_history": {
    "enabled": true,
    "max_contacts": 25
}
```

# How does it work?

The Contact History [View](https://www.twilio.com/docs/flex/developer/ui/custom-views-and-routes) is added to the [View Collection](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/programmable-components/components/ViewCollection/) and a new SideLink component is added to the [Navigation Menu](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/programmable-components/components/SideNav/).

For every task that is completed, the task and call data is added to the list of contacts in the Redux store. Every Redux update is also copied into the browser local storage.  If a user logs back into Flex, the contact list in Redux is re-initialized from local storage. ***Note that because the data is stored in the browser, it does not persist across different computers.***

Clicking on the Phone Button next to the phone number (customer address) triggers the [StartOutboundCall Action](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/ui-actions/Actions/#StartOutboundCall) to make the outbound call. This button is only visible for completed calls (voice tasks). 