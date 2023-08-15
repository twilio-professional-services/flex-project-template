import React from 'react';
import { Icon, useFlexSelector } from '@twilio/flex-ui';
import { PieChart } from 'react-minimal-pie-chart';
import { Data } from 'react-minimal-pie-chart/types/commonTypes';
import AppState from 'types/manager/AppState';
import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';

import { TileWrapper, Title, Summary, Chart, Channel, Label, Metric, SLPct } from './AllChannelsSLATile.Components';
import QueueDataUtil from '../../utils/QueueDataUtil';
import { SLMetrics } from '../../types';

interface ComponentProps {
  colors: {
    [key: string]: string;
  };
}
const AllChannelsSLATile = (props: ComponentProps) => {
  const sla: SLMetrics = useFlexSelector((state: AppState) => {
    const queues: WorkerQueue[] = Object.values(state.flex.realtimeQueues.queuesList);
    return QueueDataUtil.getSLTodayByChannel(queues);
  });
  const { colors } = props;
  const handledVoice = sla.voice.handledTasks || 0;
  const handledChat = sla.chat.handledTasks || 0;
  const handledSMS = sla.sms.handledTasks || 0;
  const slPctVoice = sla.voice.serviceLevelPct;
  const slPctChat = sla.chat.serviceLevelPct;
  const slPctSMS = sla.sms.serviceLevelPct;
  const data: Data = [];
  if (handledVoice) data.push({ title: 'voice', value: handledVoice, color: colors.voice });
  if (handledChat) data.push({ title: 'chat', value: handledChat, color: colors.chat });
  if (handledSMS) data.push({ title: 'sms', value: handledSMS, color: colors.sms });
  return (
    <TileWrapper className="Twilio-AggregatedDataTile">
      <Summary>
        <Title>SLA Today</Title>
        <Channel>
          <Icon icon="Call" />
          <Label bgColor={colors.voice}>Voice:</Label>
          {handledVoice > 0 ? <SLPct value={slPctVoice}> {slPctVoice}% </SLPct> : <Metric> - </Metric>}
        </Channel>
        <Channel>
          <Icon icon="Message" />
          <Label bgColor={colors.chat}>Chat:</Label>
          {handledChat > 0 ? <SLPct value={slPctChat}> {slPctChat}% </SLPct> : <Metric> - </Metric>}
        </Channel>
        <Channel>
          <Icon icon="Sms" />
          <Label bgColor={colors.sms}>SMS:</Label>
          {handledSMS > 0 ? <SLPct value={slPctSMS}> {slPctSMS}% </SLPct> : <Metric> - </Metric>}
        </Channel>
      </Summary>
      <Chart>
        <Title>Handled Today</Title>
        <PieChart
          labelStyle={{
            fontSize: '14px',
            fill: 'Black',
          }}
          data={data}
          label={({ dataEntry }) => dataEntry.value}
        />
      </Chart>
    </TileWrapper>
  );
};

export default AllChannelsSLATile;
