---
sidebar_label: scrollable-activities
sidebar_position: 23
title: scrollable-activities
---

This feature will add a scrolling CSS config to the activities drop down. This is useful when a large number of activities have been created in the system.

# flex-user-experience

![alt text](/img/f2/scrollable-activities/flex-user-experience-scrollable-activities.gif)

# setup and dependencies

There are no dependencies for setup beyond ensuring the flag is enabled within the flex-config attributes.

# how does it work?

The styles for the menu object are modified to set a max height, and then to enable a scrollbar if the max height is exceeded.
