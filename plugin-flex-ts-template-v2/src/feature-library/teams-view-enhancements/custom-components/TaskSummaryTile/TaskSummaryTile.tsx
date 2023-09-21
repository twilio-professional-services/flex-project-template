import { Icon, useFlexSelector } from '@twilio/flex-ui';
import * as React from 'react';
import { Box, Table, THead, TBody, Th, Tr, Td } from '@twilio-paste/core';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';
import Tooltip from '@material-ui/core/Tooltip';
import { CallIncomingIcon } from '@twilio-paste/icons/esm/CallIncomingIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

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
      <Box overflowY="auto" maxHeight="240px">
        <Table variant="default">
          <THead stickyHeader top={0}>
            <Tr>
              <Th element="COMPACT_TABLE">
                <Heading> Team </Heading>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelVoice_Color()}>
                  <Tooltip title="Inbound Calls" placement="top" arrow={true}>
                    <Heading>
                      <CallIncomingIcon decorative={false} title="In" />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelVoice_Color()}>
                  <Tooltip title="Outbound Calls" placement="top" arrow={true}>
                    <Heading>
                      <CallOutgoingIcon decorative={false} title="Out" />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelChat_Color()}>
                  <Tooltip title="Chat" placement="top" arrow={true}>
                    <Heading>
                      <Icon icon="Message" />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelSMS_Color()}>
                  <Tooltip title="SMS" placement="top" arrow={true}>
                    <Heading>
                      <Icon icon="Sms" />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
            </Tr>
          </THead>
          <TBody>
            {teams.map((team) => {
              return (
                <Tr key={team}>
                  <Td element="COMPACT_TABLE">
                    <Label> {team} </Label>
                  </Td>
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <Label> {taskCounts[team].tasks.voice_inbound} </Label>
                  </Td>
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <Label> {taskCounts[team].tasks.voice_outbound} </Label>
                  </Td>
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <Label> {taskCounts[team].tasks.chat} </Label>
                  </Td>
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <Label> {taskCounts[team].tasks.sms} </Label>
                  </Td>
                </Tr>
              );
            })}
            <Tr key="Total">
              <Td element="COMPACT_TABLE">
                <Label> Total (All) </Label>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Label> {taskCounts.All.tasks.voice_inbound} </Label>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Label> {taskCounts.All.tasks.voice_outbound} </Label>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Label> {taskCounts.All.tasks.chat} </Label>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Label> {taskCounts.All.tasks.sms} </Label>
              </Td>
            </Tr>
          </TBody>
        </Table>
      </Box>
    </TileWrapper>
  );
};

export default TaskSummaryTile;
