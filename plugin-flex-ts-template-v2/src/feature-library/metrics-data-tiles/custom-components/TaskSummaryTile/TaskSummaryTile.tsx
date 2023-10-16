import { Icon, Template, templates, useFlexSelector } from '@twilio/flex-ui';
import * as React from 'react';
import { Box } from '@twilio-paste/core/box';
import { Table, THead, TBody, Th, Tr, Td } from '@twilio-paste/core/table';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';
import { CallIncomingIcon } from '@twilio-paste/icons/esm/CallIncomingIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

import { TeamTileWrapper, TmLabel, TmHeading } from '../DataTiles.Components';
import { Channel } from './TaskSummaryTile.Components';
import { getTasksByTeamCounts } from '../../utils/WorkerDataUtil';
import { TeamTaskCounts } from '../../types';
import { getTaskSummaryChannels, getChannelsConfig, getTeams } from '../../config';
import { StringTemplates } from '../../flex-hooks/strings';
import { Channels } from '../../types/ServiceConfiguration';
import { getChannelIcon } from '../../utils/helpers';

const TaskSummaryTile = () => {
  const teams = getTeams();
  const taskCounts: TeamTaskCounts = useFlexSelector((state: AppState) => {
    const workers: SupervisorWorkerState[] = state.flex.supervisor.workers;
    return getTasksByTeamCounts(workers, teams);
  });
  const channels: Channels = getChannelsConfig();
  const channelNames = getTaskSummaryChannels();
  return (
    <TeamTileWrapper className="Twilio-AggregatedDataTile">
      <Box overflowY="auto" maxHeight="240px">
        <Table variant="borderless">
          <THead stickyHeader top={0} element="STICKY_HEADER">
            <Tr key="header">
              <Th element="COMPACT_TABLE" key="header-name">
                <TmHeading>
                  <Template source={templates[StringTemplates.TeamsViewTeamName]} />
                </TmHeading>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center" key="header-total">
                <Tooltip text={templates[StringTemplates.TeamsViewSummaryTotalTasks]()} placement="top">
                  <TmHeading>
                    <Icon icon="GenericTask" />
                  </TmHeading>
                </Tooltip>
              </Th>
              {channelNames.map((ch) => {
                if (ch === 'Voice')
                  return (
                    <>
                      <Th element="COMPACT_TABLE" textAlign="center" key="header-inbound">
                        <Channel bgColor={channels.Voice.color}>
                          <Tooltip text={templates[StringTemplates.TeamsViewSummaryInbound]()} placement="top">
                            <TmHeading>
                              <CallIncomingIcon decorative={true} />
                            </TmHeading>
                          </Tooltip>
                        </Channel>
                      </Th>
                      <Th element="COMPACT_TABLE" textAlign="center" key="header-outbound">
                        <Channel bgColor={channels.Voice.color}>
                          <Tooltip text={templates[StringTemplates.TeamsViewSummaryOutbound]()} placement="top">
                            <TmHeading>
                              <CallOutgoingIcon decorative={true} />
                            </TmHeading>
                          </Tooltip>
                        </Channel>
                      </Th>
                    </>
                  );
                return (
                  <Th element="COMPACT_TABLE" textAlign="center" key={`header-${ch}`}>
                    <Channel bgColor={channels[ch].color}>
                      <Tooltip text={ch} placement="top">
                        <TmHeading>
                          <Icon icon={getChannelIcon(ch)} />
                        </TmHeading>
                      </Tooltip>
                    </Channel>
                  </Th>
                );
              })}
            </Tr>
          </THead>
          <TBody>
            <Tr key="allteams">
              <Td element="COMPACT_TABLE" key="allteams-name">
                <TmHeading>
                  <Template source={templates[StringTemplates.TeamsViewSummaryAllTeams]} />
                </TmHeading>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center" key="allteams-total">
                <TmHeading> {taskCounts.All.totalTaskCount} </TmHeading>
              </Td>
              {channelNames.map((ch) => {
                if (ch === 'Voice')
                  return (
                    <>
                      <Td element="COMPACT_TABLE" textAlign="center" key="allteams-inbound">
                        <TmHeading> {taskCounts.All.tasks.voice_inbound} </TmHeading>
                      </Td>
                      <Td element="COMPACT_TABLE" textAlign="center" key="allteams-outbound">
                        <TmHeading> {taskCounts.All.tasks.voice_outbound} </TmHeading>
                      </Td>
                    </>
                  );
                return (
                  <Td element="COMPACT_TABLE" textAlign="center" key={`allteams-${ch}`}>
                    <TmHeading> {taskCounts.All.tasks[ch.toLowerCase()] || 0} </TmHeading>
                  </Td>
                );
              })}
            </Tr>
            {teams.map((team: string) => {
              return (
                <Tr key={team}>
                  <Td element="COMPACT_TABLE" key={`${team}-name`}>
                    <TmLabel> {team} </TmLabel>
                  </Td>
                  <Td element="COMPACT_TABLE" textAlign="center" key={`${team}-total`}>
                    <TmLabel> {taskCounts[team].totalTaskCount} </TmLabel>
                  </Td>
                  {channelNames.map((ch) => {
                    if (ch === 'Voice')
                      return (
                        <>
                          <Td element="COMPACT_TABLE" textAlign="center" key={`${team}-inbound`}>
                            <TmLabel> {taskCounts[team].tasks.voice_inbound} </TmLabel>
                          </Td>
                          <Td element="COMPACT_TABLE" textAlign="center" key={`${team}-outbound`}>
                            <TmLabel> {taskCounts[team].tasks.voice_outbound} </TmLabel>
                          </Td>
                        </>
                      );
                    return (
                      <Td element="COMPACT_TABLE" textAlign="center" key={`${team}-${ch}`}>
                        <TmLabel> {taskCounts[team].tasks[ch.toLowerCase()] || 0} </TmLabel>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
            <Tr key="Other">
              <Td element="COMPACT_TABLE" key="other-name">
                <TmLabel>
                  <Template source={templates[StringTemplates.TeamsViewSummaryOther]} />
                </TmLabel>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center" key="other-total">
                <TmLabel> {taskCounts.Other.totalTaskCount} </TmLabel>
              </Td>
              {channelNames.map((ch) => {
                if (ch === 'Voice')
                  return (
                    <>
                      <Td element="COMPACT_TABLE" textAlign="center" key="other-inbound">
                        <TmLabel> {taskCounts.Other.tasks.voice_inbound} </TmLabel>
                      </Td>
                      <Td element="COMPACT_TABLE" textAlign="center" key="other-outbound">
                        <TmLabel> {taskCounts.Other.tasks.voice_outbound} </TmLabel>
                      </Td>
                    </>
                  );
                return (
                  <Td element="COMPACT_TABLE" textAlign="center" key={`other-${ch}`}>
                    <TmLabel> {taskCounts.Other.tasks[ch.toLowerCase()] || 0} </TmLabel>
                  </Td>
                );
              })}
            </Tr>
          </TBody>
        </Table>
      </Box>
    </TeamTileWrapper>
  );
};

export default TaskSummaryTile;
