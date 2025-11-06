---
sidebar_label: scrollable-activities
title: scrollable-activities
---
import ScrollableActivitiesScreenshot from '/img/features/scrollable-activities/scrollable-activities.gif';

:::caution Deprecated
This feature is no longer required with Flex UI 2.11 and later, as the activities menu is now scrollable by default.
:::

This feature will add a scrolling CSS config to the activities drop down. This is useful when a large number of activities have been created in the system.

## flex-user-experience

<img src={ScrollableActivitiesScreenshot} style={{width: 301}} />

## setup and dependencies

There are no dependencies for setup beyond ensuring the flag is enabled within the flex-config attributes.

## how does it work?

The styles for the menu object are modified to set a max height, and then to enable a scrollbar if the max height is exceeded.
