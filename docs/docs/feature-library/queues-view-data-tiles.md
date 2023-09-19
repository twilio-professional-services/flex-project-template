---
sidebar_label: queues-view-data-tiles
title: queues-view-data-tiles
---

# Overview
The Flex Real Time Queues view provides a few standard Data Tiles that aggregate the queue data at the contact center level:

* Active Tasks: The number of tasks that are currently being handled.
* Waiting Tasks: The number of tasks that are waiting to be handled.
* Longest Wait: The amount of time in seconds for the longest waiting task.

These three Data Tiles are contained within the AggregatedDataTiles component at the top of the Queues View page. This rectangular box also contains the Bar Chart with the breakdown of the agents by status (Unavailable, Available, Offline)

As you can see from [this example in our Flex documentation](https://www.twilio.com/docs/flex/developer/ui/queues-view-programmability#add-or-remove-individual-data-tiles), you can add custom DataTiles to display custom metrics and KPIs. 

Having additional Data Tiles available with useful aggregated metrics or KPIs (by channel) gives the contact center supervisor better visibility into the traffic levels, task routing & handling efficiency and agent performance. Using tiles with color-coded backgrounds provide better visual cues and improves the overall UI. 

You can connect a custom Data Tile to the Flex Redux application store using [connect](https://react-redux.js.org/api/connect) from React-Redux. You need to provide the equivalent of a [mapStateToProps](https://react-redux.js.org/using-react-redux/connect-mapstate) function and return an object with props. Alternatively, in Flex v2 you can now leverage the [useFlexSelector](https://www.twilio.com/docs/flex/developer/ui/overview-of-flex-ui-programmability-options#useflexselector) wrapper method to extract the real time queues data from the Flex Redux store for use in a React component.

Additionally, the [Queues Data Table](https://www.twilio.com/docs/flex/developer/ui/queues-view-programmability#modify-the-queuesdatatable) can be modifed by adding columns with other queue metrics.

# How does it work?
As outlined in this [blog post](https://www.twilio.com/blog/enhance-flex-queues-view-with-custom-data-tiles), the Real Time queues data in the Flex Redux store can be aggregated into channel specific metrics, which can subsequently be rendered in a custom data tile.  These Data Tiles are added to the [AggregatedDataTiles component](https://assets.flex.twilio.com/docs/releases/flex-ui/2.2.0/programmable-components/components/QueuesStats%E2%80%A4AggregatedQueuesDataTiles/) of the [Queues Stats View](https://assets.flex.twilio.com/docs/releases/flex-ui/2.2.0/programmable-components/components/QueuesStatsView/).

This feature includes 4 different data tiles:

### Channel Task Counts Data Tiles
The Channel Task Counts Data Tile displays the Active and Waiting Tasks for a specific Task Channel (e.g voice, chat, sms, video). The Active task count is the sum of Assigned Tasks and Wrapping Tasks which are displayed separately as well.  For Voice Tasks, the number of Assigned Tasks should be equivalent to the number of agents talking.

### Channel SLA Data Tiles
The Channel SLA Data tile displays the Service Level % for all tasks associated with a specific Task Channel.  
The Service Level % is calculated as follows:
```
SL Pct = Handled Tasks within Service Level / Handled Tasks
```
The background color of the Channel SLA Tile changes based on the Service Level % value.  Service Level values >= 90 are rendered with a green background, values between 61 and 90 are shown with a yellow background and values <= 60 are displayed with a red background. These levels can be customized as needed.

### All Channels SLA Tile
This data tile combines the Service Level % for all configured channels with a Pie Chart to display a breakdown of all Handled Tasks for Today. When this combination Data Tile is enabled, you may not need to enable the individual Channel SLA tiles. 

### Enhanced Agent Activity Tile
The native Agent Activity Bar Chart adds up all Unavailable activities into 1 category (Unavailable) and does not show the agent counts for each specific Unavailable activity (for example, Break, Training, Lunch etc).  The Workspace agent activity data can be aggregated by Activity to display this more granular breakdown. For any worker activity that is not explicitly configured with a color & icon, the worker count will be combined under the OTHER category. Due to the limited space in the Data Tiles section, we suggest you configure no more than 6 or 7 Activities to highlight in this tile (and use the OTHER category for all other unavailable activities).

### Queues View Columns
This feature also includes the option to show two additional columns in the Queues Stats View: Assigned Tasks and Wrapping Tasks. Again, the Active task count column is the sum of Assigned Tasks and Wrapping Tasks. Displaying these metrics separately may give Supervisors additional insight into how their agents are performing.

# Setup

This feature can be enabled via the `flex-config` attributes. Just set the `queues_view_data_tiles` `enabled` flag to `true` and set up the desired configuration.

* To enable specific data tiles set `_DataTile = true`
* You can change the Channel colors are needed. 
* The Enhanced Agent Activity tile replaces the native Bar Chart so if you enable it you can disable the Bar Chart.
* Configure activities to match the names of the Activities as defined in TaskRouter. The Flex UI includes a [set of icons](https://www.twilio.com/docs/flex/developer/ui/v1/icons#default-icons)
 that are used to enhance the display of the individual activities.
* In the `queuesStatsColumns`, enable the additional queue metrics (assigned & wrapping tasks) to display.

```json
   "queues_view_data_tiles": {
        "enabled": true,
        "activeTasksDataTile": false,
        "waitingTasksDataTile": false,
        "longestWaitTimeDataTile": false,
        "agentsByActivityBarChart": false,
        "channels": {
          "voice": {
            "color": "#ADD8E6",
            "SLADataTile": true,
            "taskCountsDataTile": true
          },
          "chat": {
            "color": "#87CEFA",
            "SLADataTile": false,
            "taskCountsDataTile": false
          },
          "sms": {
            "color": "#59cef8",
            "SLADataTile": true,
            "taskCountsDataTile": true
          }
        },
        "allChannelsDataTile": true,
        "enhancedAgentByActivityPieChart": true,
        "agentActivityConfiguration": {
          "activities": {
            "Available": {
              "color": "green",
              "icon": "Accept"
            },
            "Outbound": {
              "color": "darkgreen",
              "icon": "Call"
            },
            "Break": {
              "color": "goldenrod",
              "icon": "Hold"
            },
            "Lunch": {
              "color": "darkorange",
              "icon": "Hamburger"
            },
            "Training": {
              "color": "red",
              "icon": "Bulb"
            },
            "Offline": {
              "color": "grey",
              "icon": "Minus"
            }
          },
          "other": {
            "color": "darkred",
            "icon": "More"
          }
        },
        "queuesStatsColumns": {
          "assignedTasksColumn": true,
          "wrappingTasksColumn": true
        }
      }
```

# Flex User Experience

![QueuesViewDataTiles](/img/features/queues-view-data-tiles/QueuesViewDataTiles2.png)