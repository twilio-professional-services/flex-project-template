import React from 'react';
import { Icon, useFlexSelector, Template, templates } from '@twilio/flex-ui';
import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';
import AppState from 'types/manager/AppState';

import { getChannelIcon } from '../../utils/helpers';
import QueueDataUtil from '../../utils/QueueDataUtil';
import {
  TileWrapper,
  Title,
  Channel,
  ChannelIcon,
  Content,
  Label,
  Metric,
  Handled,
  MetricsContainer,
} from './ChannelSLATile.Components';
import { ChannelSLMetrics, SLMetrics } from '../../types';
import { StringTemplates } from '../../flex-hooks/strings';

interface ComponentProps {
  channelName: string;
  channelList: string[];
}

const ChannelSLATileV2 = (props: ComponentProps) => {
  const { channelName, channelList } = props;
  const sla: ChannelSLMetrics = useFlexSelector((state: AppState) => {
    const queues: WorkerQueue[] = Object.values(state.flex.realtimeQueues.queuesList);
    const allSLMetrics: SLMetrics = QueueDataUtil.getSLTodayByChannel(queues, channelList);
    return allSLMetrics[channelName.toLowerCase()];
  });

  let content = '-';
  if (sla?.handledTasks && sla?.handledTasks > 0) {
    content = `${sla.serviceLevelPct}%`;
  }

  return (
    <TileWrapper value={sla?.serviceLevelPct} count={sla?.handledTasks} className="Twilio-AggregatedDataTile">
      <Channel>
        <ChannelIcon>
          <Icon icon={getChannelIcon(channelName)} />
        </ChannelIcon>
        <Title className="Twilio-AggregatedDataTile-Title">
          {`${channelName}`}
          &nbsp;
          <Template source={templates.QueuesStatsHeaderSLA} />
        </Title>
      </Channel>
      <Content className="Twilio-AggregatedDataTile-Content">{content}</Content>
      <Label>
        <Template source={templates.QueuesStatsSubHeaderToday} />
      </Label>
      <MetricsContainer>
        <Handled>
          <Label>
            <Template source={templates.QueuesStatsHeaderHandled} />
          </Label>
          <Metric>{sla?.handledTasks || 0}</Metric>
        </Handled>
        <Handled>
          <Label>
            <Template source={templates[StringTemplates.WithinSL]} />
          </Label>
          <Metric>{sla?.handledTasksWithinSL || 0}</Metric>
        </Handled>
      </MetricsContainer>
    </TileWrapper>
  );
};

export default ChannelSLATileV2;
