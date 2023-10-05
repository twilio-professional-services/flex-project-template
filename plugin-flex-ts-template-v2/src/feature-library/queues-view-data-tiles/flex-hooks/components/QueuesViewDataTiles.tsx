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
  getChannelNames,
  getChannelColors,
  isChannelVoice_CountsEnabled,
  isChannelChat_CountsEnabled,
  isChannelSMS_CountsEnabled,
  isChannelVoice_SLAEnabled,
  isChannelChat_SLAEnabled,
  isChannelSMS_SLAEnabled,
  isAllChannels_SLAEnabled,
  isEnhancedAgentsByActivityPieChartEnabled,
  getAgentActivityConfig,
} from '../../config';

const colors = getChannelColors();
export const componentName = FlexComponent.QueueStats;
export const componentHook = function addDataTiles(flex: typeof Flex) {
  if (isChannelVoice_CountsEnabled()) {
    const options: Flex.ContentFragmentProps = { sortOrder: -6 };
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelTaskCountTile
        key="voice-tasks"
        channelName="Voice"
        bgColor={colors.voice}
        channelList={getChannelNames()}
      />,
      options,
    );
  }
  if (isChannelChat_CountsEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelTaskCountTile
        key="chat-tasks"
        channelName="Chat"
        bgColor={colors.chat}
        channelList={getChannelNames()}
      />,
      { sortOrder: -5 },
    );
  }
  if (isChannelSMS_CountsEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelTaskCountTile key="sms-tasks" channelName="SMS" bgColor={colors.sms} channelList={getChannelNames()} />,
      { sortOrder: -4 },
    );
  }
  if (isChannelVoice_SLAEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelSLATile key="voice-sla-tile" channelName="Voice" channelList={getChannelNames()} />,
      { sortOrder: -3 },
    );
  }
  if (isChannelChat_SLAEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelSLATile key="chat-sla-tile" channelName="Chat" channelList={getChannelNames()} />,
      {
        sortOrder: -2,
      },
    );
  }
  if (isChannelSMS_SLAEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <ChannelSLATile key="sms-sla-tile" channelName="SMS" channelList={getChannelNames()} />,
      {
        sortOrder: -1,
      },
    );
  }
  if (isAllChannels_SLAEnabled()) {
    flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
      <AllChannelsSLATile key="combo-data-tile" colors={colors} channelList={getChannelNames()} />,
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
