import { Icon, Template, templates, useFlexSelector } from '@twilio/flex-ui';
import * as React from 'react';
import { Box } from '@twilio-paste/core/box';
import { Table, THead, TBody, Th, Tr, Td } from '@twilio-paste/core/table';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';
import { EmojiIcon } from '@twilio-paste/icons/esm/EmojiIcon';

import { getAgentActivityConfig, getIdleStatusColor, getBusyStatusColor, getTeams } from '../../config';
import { TeamTileWrapper, TmLabel, TmHeading } from '../DataTiles.Components';
import { AgentActivity } from './AgentTeamActivityTile.Components';
import { getAgentStatusCounts } from '../../utils/WorkerDataUtil';
import { TeamActivityCounts } from '../../types';
import { StringTemplates } from '../../flex-hooks/strings';

const AgentTeamActivityTile = () => {
  const teams = getTeams();
  const workerActivityCounts: TeamActivityCounts = useFlexSelector((state: AppState) => {
    const workers: SupervisorWorkerState[] = state.flex.supervisor.workers;
    return getAgentStatusCounts(workers, teams);
  });
  const activityConfig = getAgentActivityConfig();
  const statusIdleColor = getIdleStatusColor();
  const statusBusyColor = getBusyStatusColor();
  const activityNames = Object.keys(activityConfig.activities);

  return (
    <TeamTileWrapper className="Twilio-AggregatedDataTile">
      <Box overflowY="auto" maxHeight="240px">
        <Table variant="borderless">
          <THead stickyHeader top={0} element="STICKY_HEADER">
            <Tr key="headerRow">
              <Th element="COMPACT_TABLE">
                <TmHeading>
                  <Template source={templates[StringTemplates.TeamsViewTeamName]} />
                </TmHeading>
              </Th>
              <Th element="COMPACT_TABLE" textAlign="center">
                <Tooltip text={templates[StringTemplates.TeamsViewSummaryTotalAgents]()} placement="top">
                  <TmHeading>
                    <Icon icon="Agents" />
                  </TmHeading>
                </Tooltip>
              </Th>
              <Th element="COMPACT_TABLE">
                <AgentActivity bgColor={statusIdleColor}>
                  <Tooltip text={templates[StringTemplates.StatusIdleTooltip]()} placement="top">
                    <TmHeading>
                      <EmojiIcon decorative={true} />
                    </TmHeading>
                  </Tooltip>
                </AgentActivity>
              </Th>
              <Th element="COMPACT_TABLE">
                <AgentActivity bgColor={statusBusyColor}>
                  <Tooltip text={templates[StringTemplates.StatusBusyTooltip]()} placement="top">
                    <TmHeading>
                      <Icon icon="GenericTask" />
                    </TmHeading>
                  </Tooltip>
                </AgentActivity>
              </Th>
              {activityNames.map((activity) => {
                return (
                  <Th element="COMPACT_TABLE" key={activity}>
                    <AgentActivity bgColor={activityConfig.activities[activity].color}>
                      <Tooltip text={activity} placement="top">
                        <TmHeading>
                          <Icon icon={activityConfig.activities[activity]?.icon} />
                        </TmHeading>
                      </Tooltip>
                    </AgentActivity>
                  </Th>
                );
              })}
            </Tr>
          </THead>
          <TBody>
            <Tr key="All">
              <Td element="COMPACT_TABLE">
                <TmHeading>
                  <Template source={templates[StringTemplates.TeamsViewSummaryAllTeams]} />
                </TmHeading>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <TmHeading>{workerActivityCounts.All.totalAgentCount} </TmHeading>
              </Td>
              <Td element="COMPACT_TABLE_BG30" textAlign="center">
                <TmHeading>{workerActivityCounts.All.activities.Idle} </TmHeading>
              </Td>
              <Td element="COMPACT_TABLE_BG20" textAlign="center">
                <TmHeading>{workerActivityCounts.All.activities.Busy} </TmHeading>
              </Td>
              {activityNames.map((activity) => {
                return (
                  <Td element="COMPACT_TABLE" textAlign="center" key={activity}>
                    <TmHeading> {workerActivityCounts.All.activities[activity] || 0} </TmHeading>
                  </Td>
                );
              })}
            </Tr>
            {teams.map((team: string) => {
              const agentCount = workerActivityCounts[team].totalAgentCount;
              return (
                <Tr key={team}>
                  <Td element="COMPACT_TABLE">
                    <TmLabel> {team} </TmLabel>
                  </Td>
                  <Td element="COMPACT_TABLE" textAlign="center">
                    <TmLabel>{agentCount} </TmLabel>
                  </Td>
                  <Td element="COMPACT_TABLE_BG30" textAlign="center">
                    <TmLabel>{workerActivityCounts[team].activities.Idle} </TmLabel>
                  </Td>
                  <Td element="COMPACT_TABLE_BG20" textAlign="center">
                    <TmLabel>{workerActivityCounts[team].activities.Busy} </TmLabel>
                  </Td>
                  {activityNames.map((activity) => {
                    return (
                      <Td element="COMPACT_TABLE" textAlign="center" key={activity}>
                        <TmLabel>{workerActivityCounts[team].activities[activity] || 0}</TmLabel>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
            <Tr key="Other">
              <Td element="COMPACT_TABLE">
                <TmLabel>
                  <Template source={templates[StringTemplates.TeamsViewSummaryOther]} />
                </TmLabel>
              </Td>
              <Td element="COMPACT_TABLE" textAlign="center">
                <TmLabel>{workerActivityCounts.Other.totalAgentCount} </TmLabel>
              </Td>
              <Td element="COMPACT_TABLE_BG30" textAlign="center">
                <TmLabel>{workerActivityCounts.Other.activities.Idle} </TmLabel>
              </Td>
              <Td element="COMPACT_TABLE_BG20" textAlign="center">
                <TmLabel>{workerActivityCounts.Other.activities.Busy} </TmLabel>
              </Td>
              {activityNames.map((activity) => {
                return (
                  <Td element="COMPACT_TABLE" textAlign="center" key={activity}>
                    <TmLabel> {workerActivityCounts.Other.activities[activity] || 0} </TmLabel>
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

export default AgentTeamActivityTile;
