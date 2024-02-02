import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { Box } from '@twilio-paste/core/box';
import { BaseDataEntry, Data } from 'react-minimal-pie-chart/types/commonTypes';
import { Icon, useFlexSelector, Template, templates } from '@twilio/flex-ui';
import AppState from 'types/manager/AppState';
import { ActivityStatistic } from '@twilio/flex-ui/src/state/QueuesState';

import { WideTileWrapper, Title, Summary, Chart } from '../DataTiles.Components';
import { AgentActivity, Label, Metric } from './AgentActivityTile.Components';
import { StringTemplates } from '../../flex-hooks/strings';

interface ActivityCounts {
  [key: string]: number;
}

interface ComponentProps {
  activityConfig: {
    activities: {
      [key: string]: {
        color: string;
        icon: string;
      };
    };
    other: {
      color: string;
      icon: string;
    };
  };
}
const AgentActivityTile = (props: ComponentProps) => {
  const { activityConfig } = props;
  const workerActivityCounts: ActivityStatistic[] = useFlexSelector((state: AppState) => {
    return state.flex.realtimeQueues.workspaceStats?.activity_statistics || [];
  });
  const activityCounts: ActivityCounts = {};
  let otherUnavailable = 0;
  const data: Data = [];
  workerActivityCounts.forEach((activity) => {
    const count = activity.workers;
    if (count && activityConfig.activities[activity.friendly_name]) {
      activityCounts[activity.friendly_name] = count;
      const dataEntry: BaseDataEntry = {
        title: activity.friendly_name,
        value: count,
        color: activityConfig.activities[activity.friendly_name]?.color,
      };
      data.push(dataEntry);
    } else otherUnavailable += count;
  });
  if (otherUnavailable > 0) {
    activityCounts.other = otherUnavailable;
    const other: BaseDataEntry = { title: 'Other', value: otherUnavailable, color: activityConfig.other?.color };
    data.push(other);
  }
  const activityNames = Object.keys(activityConfig.activities);

  return (
    <WideTileWrapper className="Twilio-AggregatedDataTile">
      <Summary>
        <Box overflowY="auto" maxHeight="190px">
          {activityNames.map((activity) => {
            const count = activityCounts[activity] || 0;
            return (
              <AgentActivity key={activity}>
                <Icon icon={activityConfig.activities[activity]?.icon} />
                <Label bgColor={activityConfig.activities[activity]?.color}>{activity}</Label>
                <Metric> {count} </Metric>
              </AgentActivity>
            );
          })}
          <AgentActivity key="other">
            <Icon icon={activityConfig.other?.icon} />
            <Label bgColor={activityConfig.other?.color}>
              <Template source={templates[StringTemplates.Other]} />
            </Label>
            <Metric> {activityCounts.other} </Metric>
          </AgentActivity>
        </Box>
      </Summary>
      <Chart>
        <Title>
          <Template source={templates.AgentsByActivityTileTitle} />
        </Title>
        <PieChart
          labelStyle={{
            fontSize: '14px',
            fill: 'White',
          }}
          data={data}
          label={({ dataEntry }) => dataEntry.value}
        />
      </Chart>
    </WideTileWrapper>
  );
};

export default AgentActivityTile;
