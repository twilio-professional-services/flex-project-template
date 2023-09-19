import { Icon, useFlexSelector } from '@twilio/flex-ui';
import * as React from 'react';
import { Table, THead, TBody, Th, Tr, Td } from '@twilio-paste/core';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';
import Tooltip from '@material-ui/core/Tooltip';

import { getTeamNames } from '../../config';
import { TileWrapper, Channel, Label, Heading } from './TaskSummaryTile.Components';
import { getTasksByTeamCounts } from '../../utils/WorkerDataUtil';
import { TaskCounts } from '../../types';
import {
  getChannelVoice_Color,
  getChannelChat_Color,
  getChannelSMS_Color,
} from '../../../queues-view-data-tiles/config';

const TaskSummaryTile = () => {
  const teams = getTeamNames();
  const taskCounts: TaskCounts = useFlexSelector((state: AppState) => {
    const workers: SupervisorWorkerState[] = state.flex.supervisor.workers;
    return getTasksByTeamCounts(workers, teams);
  });
  return (
    <TileWrapper className="Twilio-AggregatedDataTile">
      <Table variant="default">
        <THead>
          <Tr>
            <Th>
              <Heading> Team </Heading>
            </Th>
            <Th textAlign="center">
              <Channel bgColor={getChannelVoice_Color()}>
                <Tooltip title="Inbound Calls" placement="top" arrow={true}>
                  <Heading>
                    &rarr;
                    <Icon icon="Call" />
                  </Heading>
                </Tooltip>
              </Channel>
            </Th>
            <Th textAlign="center">
              <Channel bgColor={getChannelVoice_Color()}>
                <Tooltip title="Outbound Calls" placement="top" arrow={true}>
                  <Heading>
                    <Icon icon="Call" />
                    &rarr;
                  </Heading>
                </Tooltip>
              </Channel>
            </Th>
            <Th textAlign="center">
              <Channel bgColor={getChannelChat_Color()}>
                <Icon icon="Message" />
                <Heading> Chat </Heading>
              </Channel>
            </Th>
            <Th textAlign="center">
              <Channel bgColor={getChannelSMS_Color()}>
                <Icon icon="Sms" />
                <Heading> SMS </Heading>
              </Channel>
            </Th>
          </Tr>
        </THead>
        <TBody>
          {teams.map((team) => {
            return (
              <Tr key={team}>
                <Td>
                  <Label> {team} </Label>
                </Td>
                <Td textAlign="center">
                  <Label> {taskCounts[team].tasks.voice_inbound} </Label>
                </Td>
                <Td textAlign="center">
                  <Label> {taskCounts[team].tasks.voice_outbound} </Label>
                </Td>
                <Td textAlign="center">
                  <Label> {taskCounts[team].tasks.chat} </Label>
                </Td>
                <Td textAlign="center">
                  <Label> {taskCounts[team].tasks.sms} </Label>
                </Td>
              </Tr>
            );
          })}
          <Tr key="Total">
            <Td>
              <Label> Total (All) </Label>
            </Td>
            <Td textAlign="center">
              <Label> {taskCounts.All.tasks.voice_inbound} </Label>
            </Td>
            <Td textAlign="center">
              <Label> {taskCounts.All.tasks.voice_outbound} </Label>
            </Td>
            <Td textAlign="center">
              <Label> {taskCounts.All.tasks.chat} </Label>
            </Td>
            <Td textAlign="center">
              <Label> {taskCounts.All.tasks.sms} </Label>
            </Td>
          </Tr>
        </TBody>
      </Table>
    </TileWrapper>
  );
};

export default TaskSummaryTile;
