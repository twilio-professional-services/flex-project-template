import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import ChannelTaskCountTile from '../../custom-components/ChannelTaskCountTile/ChannelTaskCountTile';
import ChannelSLATile from '../../custom-components/ChannelSLATile/ChannelSLATile';
import AllChannelsSLATile from '../../custom-components/AllChannelsSLATile/AllChannelsSLATile';
import AgentActivityTile from '../../custom-components/AgentActivityTile/AgentActivityTile';
import {
  isActiveTasksEnabled,
  isWaitingTasksEnabled,
  isLongestWaitTimeEnabled,
  isAgentsByActivityEnabled,
  getChannelsConfig,
  getChannelColors,
  getTaskCountsTileChannels,
  getSLATileChannels,
  isAllChannels_SLAEnabled,
  isEnhancedAgentsByActivityPieChartEnabled,
  getAgentActivityConfig,
} from '../../config';

const colors = getChannelColors();
const channelList = Object.keys(getChannelsConfig()).map((ch) => ch.toLowerCase());
export const componentName = FlexComponent.QueueStats;
export const componentHook = function addDataTiles(flex: typeof Flex) {
  const taskCountsTileChannels = getTaskCountsTileChannels();
  taskCountsTileChannels.forEach((ch) => {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelTaskCountTile
        key={`${ch}-tasks`}
        channelName={ch}
        bgColor={colors[ch.toLowerCase()]}
        channelList={channelList}
      />,
      { sortOrder: 0 },
    );
  });

  const slaTileChannels = getSLATileChannels();
  slaTileChannels.forEach((ch) => {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelSLATile key={`${ch}-sla`} channelName={ch} channelList={channelList} />,
      { sortOrder: 0 },
    );
  });

  if (isAllChannels_SLAEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <AllChannelsSLATile key="combo-data-tile" colors={colors} channelList={channelList} />,
      { sortOrder: 0 },
    );
  }

  if (isEnhancedAgentsByActivityPieChartEnabled()) {
    const agentActivityConfig = getAgentActivityConfig();
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <AgentActivityTile key="agent-activity-tile" activityConfig={agentActivityConfig} />,
      { sortOrder: 6 },
    );
  }

  if (!isActiveTasksEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove('active-tasks-tile');
  }
  if (!isWaitingTasksEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove('waiting-tasks-tile');
  }
  if (!isLongestWaitTimeEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove('longest-wait-time-tile');
  }
  if (!isAgentsByActivityEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove('agents-by-activity-chart-tile');
  }
};
