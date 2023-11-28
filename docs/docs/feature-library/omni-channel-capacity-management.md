---
sidebar_label: omni-channel-capacity-management
title: omni-channel-capacity-management
---

This feature is intended for use when the solution imposes the following parameters

- chat and other channels are mutually exclusive (using workflow expressions, see below)
- chat users have a capacity greater than 1

The reason for this is; if for example voice has a capacity of 1 and chat has a capacity of 2 and there is a backlog of chat work, the agent would be locked into doing that chat work as each time a chat task is dismissed, another chat task would take its place. This means that the chat backlog would
need to be exhausted before the user would ever qualify for voice work.

To address this, this feature toggles agents between the configured chat capacity and a chat capacity of 1, ensuring taskrouter can route the most important piece of work to the user across both channels.

## flex-user-experience

Example delivery of callbacks (on voice channel of capacity 1) and chat tasks (max capacity 2) where the task backlog is ordered callback, chat, callback, chat, callback, chat, callback, chat, callback

![alt text](/img/features/omni-channel-capacity-management/flex-user-experience-omni-channel-capacity-management.gif)

## setup and dependencies

1. Make sure the feature is enabled in the flex-config, and the affected channel and default max capacity settings are configured as desired.

2. Ensure that for your workflows assigning work, they use the relevant workflow expression.

For example for workflows assinging chat work to queues

- worker.channel.voice.available_capacity_percentage == 100
  For workflows assinging voice work to queues
- worker.channel.chat.available_capacity_percentage == 100

If other channels are in use, then modify accordingly

## how does it work?

By using the workflow expressions to keep reservations of different channels mutually excluded, the solution works by moving the agents channel capacity to 1 any time they hit their max capacity, while storing the previous max capacity in local storage. Then this allows taskrouter to assign the next relevant piece of work. As soon as that work is accepted, this feature automatically puts their capacity back to the previous setting from local storage.
