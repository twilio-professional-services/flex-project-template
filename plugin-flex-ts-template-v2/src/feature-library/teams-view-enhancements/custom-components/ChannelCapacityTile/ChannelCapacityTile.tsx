import { Icon, Template, templates, useFlexSelector } from '@twilio/flex-ui';
import { PieChart } from 'react-minimal-pie-chart';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';

import { getTasksAndCapacity } from '../../utils/WorkerDataUtil';
import {
  TileWrapper,
  Title,
  Chart,
  TaskCount,
  Label,
  Metric,
  MetricsContainer,
  Channel,
  ChannelIcon,
} from './ChannelCapacityTile.Components';
import { TasksAndCapacity } from '../../types';
import { getChannelColors } from '../../../queues-view-data-tiles/config';
import { getChannelIcon } from '../../utils/helpers';
import { StringTemplates } from '../../flex-hooks/strings';

interface ComponentProps {
  channelName: string;
}

const ChannelCapacityTile = (props: ComponentProps) => {
  const { channelName } = props;
  const tasksAndCapacity: TasksAndCapacity = useFlexSelector((state: AppState) => {
    const workers: SupervisorWorkerState[] = state.flex.supervisor.workers;
    return getTasksAndCapacity(workers);
  });
  const taskCount = tasksAndCapacity.tasks[channelName.toLowerCase()];
  const capacity = tasksAndCapacity.capacity[channelName.toLowerCase()];
  const available = capacity - taskCount;

  const data = [];
  if (taskCount > 0) data.push({ title: 'Busy', value: taskCount, color: 'yellow' });
  data.push({ title: 'Available', value: available, color: 'limegreen' });

  let used = '-';
  if (capacity > 0) {
    const pct = Math.round((taskCount / capacity) * 100);
    used = `${pct}%`;
  }
  const bgColor = getChannelColors()[channelName.toLowerCase()];
  return (
    <TileWrapper className="Twilio-AggregatedDataTile">
      <Channel bgColor={bgColor}>
        <ChannelIcon>
          <Icon icon={getChannelIcon(channelName)} />
        </ChannelIcon>
        <Title className="Twilio-AggregatedDataTile-Title">
          {`${channelName}`}
          &nbsp;
          <Template source={templates[StringTemplates.ChannelCapacityTitle]} />
        </Title>
      </Channel>
      <MetricsContainer>
        <Chart>
          <PieChart
            labelStyle={{
              fontSize: '10px',
              fill: 'Black',
            }}
            startAngle={180}
            lengthAngle={180}
            viewBoxSize={[100, 50]}
            data={data}
            label={({ dataEntry }) => dataEntry.value}
          />
        </Chart>
      </MetricsContainer>
      <MetricsContainer>
        <TaskCount>
          <Label>
            <Template source={templates[StringTemplates.ChannelCapacityTasks]} />
          </Label>
          <Metric> {taskCount} </Metric>
        </TaskCount>
        <TaskCount>
          <Label>
            <Template source={templates[StringTemplates.ChannelCapacityUsed]} />
          </Label>
          <Metric> {used} </Metric>
        </TaskCount>
        <TaskCount>
          <Label>
            <Template source={templates[StringTemplates.ChannelCapacityMax]} />
          </Label>
          <Metric> {capacity} </Metric>
        </TaskCount>
      </MetricsContainer>
    </TileWrapper>
  );
};

export default ChannelCapacityTile;
