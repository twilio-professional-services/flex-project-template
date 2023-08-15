import React from 'react';
import { Icon, useFlexSelector } from '@twilio/flex-ui';
import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';
import AppState from 'types/manager/AppState';

import QueueDataUtil from '../../utils/QueueDataUtil';
import { TileWrapper, Title, Channel, ChannelIcon, Content, Label, Metric, Handled } from './ChannelSLATile.Components';
import { ChannelSLMetrics, SLMetrics } from '../../types';

interface ComponentProps {
  channelName: string;
}

const ChannelSLATileV2 = (props: ComponentProps) => {
  const { channelName } = props;
  const sla: ChannelSLMetrics = useFlexSelector((state: AppState) => {
    const queues: WorkerQueue[] = Object.values(state.flex.realtimeQueues.queuesList);
    const allSLMetrics: SLMetrics = QueueDataUtil.getSLTodayByChannel(queues);
    return allSLMetrics[channelName];
  });

  let content = '-';
  if (sla.handledTasks && sla.handledTasks > 0) {
    content = `${sla.serviceLevelPct}%`;
  }

  return (
    <TileWrapper value={sla.serviceLevelPct} count={sla.handledTasks} className="Twilio-AggregatedDataTile">
      <Channel>
        <ChannelIcon>
          {channelName === 'voice' && <Icon icon="Call" />}
          {channelName === 'chat' && <Icon icon="Message" />}
          {channelName === 'sms' && <Icon icon="Sms" />}
        </ChannelIcon>
        <Title className="Twilio-AggregatedDataTile-Title">{`${channelName} SLA`}</Title>
      </Channel>
      <Content className="Twilio-AggregatedDataTile-Content">{content}</Content>
      <Handled>
        <Label>Handled Today: </Label>
        <Metric>{sla.handledTasks}</Metric>
      </Handled>
      <Handled>
        <Label>Within SL: </Label>
        <Metric>{sla.handledTasksWithinSL}</Metric>
      </Handled>
    </TileWrapper>
  );
};

export default ChannelSLATileV2;
