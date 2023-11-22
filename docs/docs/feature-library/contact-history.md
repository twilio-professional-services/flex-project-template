---
sidebar_label: contact-history
title: Contact History
---

## Overview

This feature adds a Contact History [View](https://www.twilio.com/docs/flex/developer/ui/custom-views-and-routes) to the Flex UI and allows agents to make outbound calls (click-to-dial) back to the customers. The recent contacts list is stored in the Redux state (and persisted in localStorage browser cache). The Max Number of Contacts retained is configurable and agents can clear their contact history by clicking the Clear History button. 

The Contact History [View](https://www.twilio.com/docs/flex/developer/ui/custom-views-and-routes) is added to the [View Collection](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/programmable-components/components/ViewCollection/) and a new SideLink component is added to the [Navigation Menu](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/programmable-components/components/SideNav/).

Clicking on the customer's phone number triggers the [StartOutboundCall Action](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.1/ui-actions/Actions/#StartOutboundCall) to make the outbound call. 

## flex-user-experience


## setup and dependencies

You can enable this feature and set the maximum number of recent contacts in the configuration as follows:

```json
"contact_history": {
    "enabled": true,
    "max_contacts": 25
}
```


