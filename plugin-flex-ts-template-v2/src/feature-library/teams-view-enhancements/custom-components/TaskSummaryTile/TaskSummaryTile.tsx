import { Icon, Template, templates, useFlexSelector } from '@twilio/flex-ui';
import * as React from 'react';
import { Box, Table, THead, TBody, Th, Tr, Td, Tooltip } from '@twilio-paste/core';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';
import { CallIncomingIcon } from '@twilio-paste/icons/esm/CallIncomingIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

import { TileWrapper, Channel, Label, Heading } from './TaskSummaryTile.Components';
import { getTasksByTeamCounts } from '../../utils/WorkerDataUtil';
import { TaskCounts } from '../../types';
import { getEnabledChannels, getChannelsConfig, getTeams } from '../../config';
import { StringTemplates } from '../../flex-hooks/strings';
import { Channels } from '../../types/ServiceConfiguration';
import { getChannelIcon } from '../../utils/helpers';

const TaskSummaryTile = () => {
  const teams = getTeams();
  const taskCounts: TaskCounts = useFlexSelector((state: AppState) => {
    const workers: SupervisorWorkerState[] = state.flex.supervisor.workers;
    return getTasksByTeamCounts(workers, teams);
  });
  const channels: Channels = getChannelsConfig();
  const channelNames = getEnabledChannels();

  return (
    <TileWrapper className="Twilio-AggregatedDataTile">
      <Box overflowY="auto" maxHeight="240px">
        <Table variant="borderless">
          <THead stickyHeader top={0} element="STICKY_HEADER">
            <Tr>
              <Th element="COMPACT_TABLE">
                <Heading>
                  <Template source={templates[StringTemplates.TeamsViewColumnTeamName]} />
                </Heading>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Tooltip text={templates[StringTemplates.TeamsViewSummaryTotalTasks]()} placement="top">
                  <Heading>
                    <Icon icon="GenericTask" />
                  </Heading>
                </Tooltip>
              </Th>
              {channelNames.map((ch) => {
                if (ch === 'Voice')
                  return (
                    <>
                      <Th element="COMPACT_TABLE" textAlign="center">
                        <Channel bgColor={channels.Voice.color}>
                          <Tooltip text={templates[StringTemplates.TeamsViewSummaryInbound]()} placement="top">
                            <Heading>
                              <CallIncomingIcon decorative={true} />
                            </Heading>
                          </Tooltip>
                        </Channel>
                      </Th>
                      <Th element="COMPACT_TABLE" textAlign="center">
                        <Channel bgColor={channels.Voice.color}>
                          <Tooltip text={templates[StringTemplates.TeamsViewSummaryOutbound]()} placement="top">
                            <Heading>
                              <CallOutgoingIcon decorative={true} />
                            </Heading>
                          </Tooltip>
                        </Channel>
                      </Th>
                    </>
                  );
                return (
                  <Th element="COMPACT_TABLE" textAlign="center">
                    <Channel bgColor={channels[ch].color}>
                      <Tooltip text={ch} placement="top">
                        <Heading>
                          <Icon icon={getChannelIcon(ch)} />
                        </Heading>
                      </Tooltip>
                    </Channel>
                  </Th>
                );
              })}
            </Tr>
          </THead>
          <TBody>
            <Tr key="Total">
              <Td element="COMPACT_TABLE">
                <Heading>
                  <Template source={templates[StringTemplates.TeamsViewSummaryAllTeams]} />
                </Heading>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Heading> {taskCounts.All.totalTaskCount} </Heading>
              </Td>
              {channelNames.map((ch) => {
                if (ch === 'Voice')
                  return (
                    <>
                      <Td element="COMPACT_TABLE" textAlign="center">
                        <Heading> {taskCounts.All.tasks.voice_inbound} </Heading>
                      </Td>
                      <Td element="COMPACT_TABLE" textAlign="center">
                        <Heading> {taskCounts.All.tasks.voice_outbound} </Heading>
                      </Td>
                    </>
                  );
                return (
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <Heading> {taskCounts.All.tasks[ch.toLowerCase()] || 0} </Heading>
                  </Td>
                );
              })}
            </Tr>
            {teams.map((team: string) => {
              return (
                <Tr key={team}>
                  <Td element="COMPACT_TABLE">
                    <Label> {team} </Label>
                  </Td>
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <Label> {taskCounts[team].totalTaskCount} </Label>
                  </Td>
                  {channelNames.map((ch) => {
                    if (ch === 'Voice')
                      return (
                        <>
                          <Td element="COMPACT_TABLE" textAlign="center">
                            <Label> {taskCounts[team].tasks.voice_inbound} </Label>
                          </Td>
                          <Td element="COMPACT_TABLE" textAlign="center">
                            <Label> {taskCounts[team].tasks.voice_outbound} </Label>
                          </Td>
                        </>
                      );
                    return (
                      <Td element="COMPACT_TABLE" textAlign="center">
                        <Label> {taskCounts[team].tasks[ch.toLowerCase()] || 0} </Label>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
            <Tr key="Other">
              <Td element="COMPACT_TABLE">
                <Label>
                  <Template source={templates[StringTemplates.TeamsViewSummaryOther]} />
                </Label>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Label> {taskCounts.Other.totalTaskCount} </Label>
              </Td>
              {channelNames.map((ch) => {
                if (ch === 'Voice')
                  return (
                    <>
                      <Td element="COMPACT_TABLE" textAlign="center">
                        <Label> {taskCounts.Other.tasks.voice_inbound} </Label>
                      </Td>
                      <Td element="COMPACT_TABLE" textAlign="center">
                        <Label> {taskCounts.Other.tasks.voice_outbound} </Label>
                      </Td>
                    </>
                  );
                return (
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <Label> {taskCounts.Other.tasks[ch.toLowerCase()] || 0} </Label>
                  </Td>
                );
              })}
            </Tr>
          </TBody>
        </Table>
      </Box>
    </TileWrapper>
  );
};

export default TaskSummaryTile;
