import React from 'react';
import { Icon, useFlexSelector, Template, templates } from '@twilio/flex-ui';
import AppState from 'types/manager/AppState';

import { getChannelIcon } from '../../utils/helpers';
import QueueDataUtil from '../../utils/QueueDataUtil';
import {
  TileWrapper,
  Title,
  Content,
  Channel,
  ChannelIcon,
  Label,
  Metric,
  MetricMiniTile,
  MetricsContainer,
} from '../DataTiles.Components';
import { ChannelTaskCounts, TaskCounts } from '../../types';

interface ComponentProps {
  channelName: string;
  channelList: string[];
  bgColor?: string;
}

const ChannelTaskCountTile = (props: ComponentProps) => {
  const { channelName, channelList, bgColor } = props;
  const taskCounts: ChannelTaskCounts = useFlexSelector((state: AppState) => {
    const queues = Object.values(state.flex.realtimeQueues.queuesList);
    const allTaskCounts: TaskCounts = QueueDataUtil.getTaskCountsByChannel(queues, channelList);
    return allTaskCounts[channelName.toLowerCase()];
  });

  return (
    <TileWrapper className="Twilio-AggregatedDataTile" bgColor={bgColor} mode="light">
      <Channel>
        <ChannelIcon>
          <Icon icon={getChannelIcon(channelName)} />
        </ChannelIcon>
        <Title className="Twilio-AggregatedDataTile-Title" mode="light">
          {`${channelName}`}&nbsp;
          <Template source={templates.QueuesStatsHeaderActiveTasks} />
        </Title>
      </Channel>
      <Content className="Twilio-AggregatedDataTile-Content">{taskCounts?.activeTasks || 0}</Content>
      <MetricsContainer>
        <MetricMiniTile>
          <Label>
            <Template source={templates.TaskAssigned} />
          </Label>
          <Metric>{taskCounts?.assignedTasks || 0}</Metric>
        </MetricMiniTile>
        <MetricMiniTile>
          <Label>
            <Template source={templates.TaskWrapup} />
          </Label>
          <Metric>{taskCounts?.wrappingTasks || 0}</Metric>
        </MetricMiniTile>
      </MetricsContainer>
      <MetricsContainer>
        <MetricMiniTile>
          <Label>
            <Template source={templates.QueuesStatsHeaderWaitingTasks} />
          </Label>
          <Metric>{taskCounts?.waitingTasks || 0}</Metric>
        </MetricMiniTile>
      </MetricsContainer>
    </TileWrapper>
  );
};

export default ChannelTaskCountTile;
