import React from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { Table, TBody, Tr, Td } from '@twilio-paste/core';
import AppState from 'types/manager/AppState';

import QueueDataUtil from '../../utils/QueueDataUtil';
import { TileWrapper, Title, Content, Label } from './ChannelTaskCountTile.Components';
import { ChannelTaskCounts, TaskCounts } from '../../types';

interface ComponentProps {
  channelName: string;
  bgColor?: string;
}

const ChannelTaskCountTile = (props: ComponentProps) => {
  const { channelName, bgColor } = props;
  const taskCounts: ChannelTaskCounts = useFlexSelector((state: AppState) => {
    const queues = Object.values(state.flex.realtimeQueues.queuesList);
    const allTaskCounts: TaskCounts = QueueDataUtil.getTaskCountsByChannel(queues);
    return allTaskCounts[channelName];
  });

  return (
    <TileWrapper className="Twilio-AggregatedDataTile" bgColor={bgColor}>
      <Title className="Twilio-AggregatedDataTile-Title">{`${channelName} Active`}</Title>
      <Content className="Twilio-AggregatedDataTile-Content">{taskCounts.activeTasks}</Content>
      <Table variant="borderless">
        <TBody>
          <Tr>
            <Td>
              <Label>Assigned:</Label>
            </Td>
            <Td textAlign="center">
              <Label> {taskCounts.assignedTasks} </Label>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Label>Wrapping:</Label>
            </Td>
            <Td textAlign="center">
              <Label> {taskCounts.wrappingTasks} </Label>
            </Td>
          </Tr>
          <Tr>
            <Td colSpan={2}>
              <hr />
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Label>Waiting:</Label>
            </Td>
            <Td textAlign="center">
              <Label> {taskCounts.waitingTasks} </Label>
            </Td>
          </Tr>
        </TBody>
      </Table>
    </TileWrapper>
  );
};

export default ChannelTaskCountTile;
