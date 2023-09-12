import React from 'react';
import { Icon, useFlexSelector, Template, templates } from '@twilio/flex-ui';
import { PieChart } from 'react-minimal-pie-chart';
import { Data } from 'react-minimal-pie-chart/types/commonTypes';
import AppState from 'types/manager/AppState';
import { WorkerQueue } from '@twilio/flex-ui/src/state/QueuesState';

import { getChannelIcon } from '../../utils/helpers';
import { TileWrapper, Title, Summary, Chart, Channel, Label, Metric, SLPct } from './AllChannelsSLATile.Components';
import QueueDataUtil from '../../utils/QueueDataUtil';
import { SLMetrics } from '../../types';

interface ComponentProps {
  channelList: string[];
  colors: {
    [key: string]: string;
  };
}

const AllChannelsSLATile = (props: ComponentProps) => {
  const { channelList, colors } = props;
  const sla: SLMetrics = useFlexSelector((state: AppState) => {
    const queues: WorkerQueue[] = Object.values(state.flex.realtimeQueues.queuesList);
    return QueueDataUtil.getSLTodayByChannel(queues, channelList);
  });
  const data: Data = [];
  channelList.forEach((ch) => {
    const handled = sla[ch]?.handledTasks || 0;
    if (handled) data.push({ title: ch, value: handled, color: colors[ch] });
  });
  return (
    <TileWrapper className="Twilio-AggregatedDataTile">
      <Summary>
        <Title>
          <Template source={templates.QueuesStatsHeaderSLA} />
          &nbsp;
          <Template source={templates.QueuesStatsSubHeaderToday} />
        </Title>
        {channelList.map((ch) => {
          const handled = sla[ch]?.handledTasks || 0;
          const slPct = sla[ch]?.serviceLevelPct;
          return (
            <Channel key={ch}>
              <Icon icon={getChannelIcon(ch)} />
              <Label bgColor={colors[ch]}>{ch}</Label>
              {handled > 0 ? <SLPct value={slPct}> {slPct}% </SLPct> : <Metric> - </Metric>}
            </Channel>
          );
        })}
      </Summary>
      <Chart>
        <Title>
          <Template source={templates.QueuesStatsHeaderHandled} />
          &nbsp;
          <Template source={templates.QueuesStatsSubHeaderToday} />
        </Title>
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
