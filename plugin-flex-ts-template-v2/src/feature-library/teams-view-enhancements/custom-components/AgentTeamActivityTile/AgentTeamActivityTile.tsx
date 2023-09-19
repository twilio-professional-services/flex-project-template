import { Icon, useFlexSelector } from '@twilio/flex-ui';
import * as React from 'react';
import { Table, THead, TBody, Th, Tr, Td } from '@twilio-paste/core';
import { SupervisorWorkerState } from '@twilio/flex-ui/src/state/State.definition';
import AppState from 'types/manager/AppState';
import Tooltip from '@material-ui/core/Tooltip';

import { getTeamNames } from '../../config';
import { TileWrapper, AgentActivity, Label, Heading } from './AgentTeamActivityTile.Components';
import { getAgentStatusCounts } from '../../utils/WorkerDataUtil';
import { ActivityCounts } from '../../types';

interface ActivityConfig {
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
}

const AgentTeamActivityTile = () => {
  const teams = getTeamNames();
  const workerActivityCounts: ActivityCounts = useFlexSelector((state: AppState) => {
    const workers: SupervisorWorkerState[] = state.flex.supervisor.workers;
    return getAgentStatusCounts(workers, teams);
  });
  console.log('COUNTS:', workerActivityCounts);
  // Move into feature config
  const activityConfig: ActivityConfig = {
    activities: {
      Idle: { color: 'green', icon: 'Accept' },
      Busy: { color: 'limegreen', icon: 'GenericTask' },
      Outbound: { color: 'darkgreen', icon: 'Call' },
      Break: { color: 'goldenrod', icon: 'Hold' },
      Lunch: { color: 'darkorange', icon: 'Hamburger' },
      Training: { color: 'red', icon: 'Bulb' },
      Offline: { color: 'grey', icon: 'Minus' },
    },
    other: { color: 'darkred', icon: 'More' },
  };
  // Note: Idle and Busy are special Status values based on agent task counts

  const activityNames = Object.keys(activityConfig.activities);

  return (
    <TileWrapper className="Twilio-AggregatedDataTile">
      <Table variant="default">
        <THead>
          <Tr>
            <Th>
              <Heading> Team </Heading>
            </Th>
            <Th textAlign="center">
              <AgentActivity>
                <Tooltip title="Total Agents" placement="top" arrow={true}>
                  <Heading>#</Heading>
                </Tooltip>
              </AgentActivity>
            </Th>
            {activityNames.map((activity) => {
              return (
                <Th>
                  <AgentActivity bgColor={activityConfig.activities[activity].color}>
                    <Tooltip title={activity} placement="top" arrow={true}>
                      <Heading>
                        <Icon icon={activityConfig.activities[activity]?.icon} />
                      </Heading>
                    </Tooltip>
                  </AgentActivity>
                </Th>
              );
            })}
          </Tr>
        </THead>
        <TBody>
          {teams.map((team) => {
            const agentCount = workerActivityCounts[team].totalAgentCount;
            return (
              <Tr key={team}>
                <Td>
                  <Label> {team} </Label>
                </Td>
                <Td textAlign="center">
                  <Label>{agentCount} </Label>
                </Td>
                {activityNames.map((activity) => {
                  return (
                    <Td textAlign="center" key={activity}>
                      <Label> {workerActivityCounts[team].activities[activity]} </Label>
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
          <Tr key="All">
            <Td>
              <Label> Total (All) </Label>
            </Td>
            <Td textAlign="center">
              <Label>{workerActivityCounts.All.totalAgentCount} </Label>
            </Td>
            {activityNames.map((activity) => {
              return (
                <Td textAlign="center" key={activity}>
                  <Label> {workerActivityCounts.All.activities[activity]} </Label>
                </Td>
              );
            })}
          </Tr>
        </TBody>
      </Table>
    </TileWrapper>
  );
};

export default AgentTeamActivityTile;
