import React from 'react';
import { Icon, useFlexSelector, Template, templates } from '@twilio/flex-ui';
import AppState from 'types/manager/AppState';

import { getChannelIcon } from '../../utils/helpers';
import QueueDataUtil from '../../utils/QueueDataUtil';
import {
  TileWrapper,
  Title,
  Content,
  Label,
  Metric,
  TaskCount,
  MetricsContainer,
} from './ChannelTaskCountTile.Components';
import { ChannelTaskCounts, TaskCounts } from '../../types';
import { Channel, ChannelIcon } from '../ChannelSLATile/ChannelSLATile.Components';

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
    <TileWrapper className="Twilio-AggregatedDataTile" bgColor={bgColor}>
      <Channel>
        <ChannelIcon>
          <Icon icon={getChannelIcon(channelName)} />
        </ChannelIcon>
        <Title className="Twilio-AggregatedDataTile-Title">
          {`${channelName}`}&nbsp;
          <Template source={templates.QueuesStatsHeaderActiveTasks} />
        </Title>
      </Channel>
      <Content className="Twilio-AggregatedDataTile-Content">{taskCounts?.activeTasks || 0}</Content>
      <MetricsContainer>
        <TaskCount>
          <Label>
            <Template source={templates.TaskAssigned} />
          </Label>
          <Metric>{taskCounts?.assignedTasks || 0}</Metric>
        </TaskCount>
        <TaskCount>
          <Label>
            <Template source={templates.TaskWrapup} />
          </Label>
          <Metric>{taskCounts?.wrappingTasks || 0}</Metric>
        </TaskCount>
      </MetricsContainer>
      <MetricsContainer>
        <TaskCount>
          <Label>
            <Template source={templates.QueuesStatsHeaderWaitingTasks} />
          </Label>
          <Metric>{taskCounts?.waitingTasks || 0}</Metric>
        </TaskCount>
      </MetricsContainer>
    </TileWrapper>
  );
};

export default ChannelTaskCountTile;
