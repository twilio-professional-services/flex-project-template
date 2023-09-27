import { Icon, Template, templates, useFlexSelector } from '@twilio/flex-ui';
import * as React from 'react';
import { Box, Table, THead, TBody, Th, Tr, Td, Tooltip } from '@twilio-paste/core';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';
// import Tooltip from '@material-ui/core/Tooltip';
import { CallIncomingIcon } from '@twilio-paste/icons/esm/CallIncomingIcon';
import { CallOutgoingIcon } from '@twilio-paste/icons/esm/CallOutgoingIcon';

import { TileWrapper, Channel, Label, Heading } from './TaskSummaryTile.Components';
import { getTasksByTeamCounts } from '../../utils/WorkerDataUtil';
import { TaskCounts } from '../../types';
import { getChannelVoice_Color, getChannelChat_Color, getChannelSMS_Color } from '../../config';
import { getTeamOptions } from '../../../teams-view-filters/config';
import { StringTemplates } from '../../flex-hooks/strings';

const TaskSummaryTile = () => {
  const teams = getTeamOptions();
  const taskCounts: TaskCounts = useFlexSelector((state: AppState) => {
    const workers: SupervisorWorkerState[] = state.flex.supervisor.workers;
    return getTasksByTeamCounts(workers, teams);
  });
  return (
    <TileWrapper className="Twilio-AggregatedDataTile">
      <Box overflowY="auto" maxHeight="240px">
        <Table variant="borderless">
          <THead stickyHeader top={0}>
            <Tr>
              <Th element="COMPACT_TABLE">
                <Heading>
                  <Template source={templates[StringTemplates.TeamsViewColumnTeamName]} />
                </Heading>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelVoice_Color()}>
                  <Tooltip text={templates[StringTemplates.TeamsViewSummaryInbound]()} placement="top">
                    <Heading>
                      <CallIncomingIcon decorative={true} />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelVoice_Color()}>
                  <Tooltip text={templates[StringTemplates.TeamsViewSummaryOutbound]()} placement="top">
                    <Heading>
                      <CallOutgoingIcon decorative={true} />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelChat_Color()}>
                  <Tooltip text="Chat" placement="top">
                    <Heading>
                      <Icon icon="Message" />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Channel bgColor={getChannelSMS_Color()}>
                  <Tooltip text="SMS" placement="top">
                    <Heading>
                      <Icon icon="Sms" />
                    </Heading>
                  </Tooltip>
                </Channel>
              </Th>
            </Tr>
          </THead>
          <TBody>
            <Tr key="Total">
              <Td element="COMPACT_TABLE">
                <Heading>
                  <Template source={templates[StringTemplates.TeamsViewSummaryAll]} />
                </Heading>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Heading> {taskCounts.All.tasks.voice_inbound} </Heading>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Heading> {taskCounts.All.tasks.voice_outbound} </Heading>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Heading> {taskCounts.All.tasks.chat} </Heading>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <Heading> {taskCounts.All.tasks.sms} </Heading>
              </Td>
            </Tr>
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
          </TBody>
        </Table>
      </Box>
    </TileWrapper>
  );
};

export default TaskSummaryTile;
