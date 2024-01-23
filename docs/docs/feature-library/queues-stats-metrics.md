---
sidebar_label: queues-stats-metrics
title: queues-stats-metrics
---

## Overview
The Flex Real Time Queues view can be enhanced by adding columns with other queue metrics to the [Queues Data Table](https://www.twilio.com/docs/flex/developer/ui/queues-view-programmability#modify-the-queuesdatatable).

Natively Flex displays the Active tasks count per queue. The Active task count is the sum of _Assigned_ Tasks and _Wrapping_ Tasks. Displaying these metrics separately may give Supervisors additional insight into how their agents are performing.

## Setup
This feature can be enabled via the `flex-config` attributes. Just set the `queues_stats_metrics` `enabled` flag to `true` and enable the new columns as needed.

The `agent_activity_stats_column` shows a Data icon that can be clicked to pop-up a small window to display the agent count per activity for that queue.

```json
      "queues_stats_metrics": {
        "enabled": false,
        "assigned_tasks_column": true,
        "wrapping_tasks_column": true,
        "agent_activity_stats_column": true
      },
```

## Flex User Experience

![QueuesViewMetrics](/img/features/queues-stats-metrics/QueuesStatsMetrics.png)
