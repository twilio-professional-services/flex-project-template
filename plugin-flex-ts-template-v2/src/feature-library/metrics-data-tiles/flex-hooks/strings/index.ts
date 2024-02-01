import esMX from './es-mx.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  WithinSL = 'PSWithinSL',
  Other = 'PSOther',
  TeamsViewTeamName = 'PSTeamName',
  TeamsViewSummaryAllTeams = 'PSTaskSummaryAllTeams',
  TeamsViewSummaryOther = 'PSTeamsViewSummaryOther',
  TeamsViewSummaryTotalTasks = 'PSTeamsViewSummaryTotalTasks',
  TeamsViewSummaryInbound = 'PSTeamsViewSummaryInbound',
  TeamsViewSummaryOutbound = 'PSTeamsViewSummaryOutbound',
  TeamsViewSummaryTotalAgents = 'PSTeamsViewSummaryTotalAgents',
  StatusIdleLabel = 'PSStatusIdleLabel',
  StatusIdleTooltip = 'PSStatusIdleTooltip',
  StatusBusyLabel = 'PSStatusBusyLabel',
  StatusBusyTooltip = 'PSStatusBusyTooltip',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.WithinSL]: 'Within SL',
    [StringTemplates.Other]: 'Other',
    [StringTemplates.TeamsViewTeamName]: 'Team Name',
    [StringTemplates.TeamsViewSummaryAllTeams]: 'All Teams',
    [StringTemplates.TeamsViewSummaryOther]: 'Other',
    [StringTemplates.TeamsViewSummaryTotalTasks]: 'Total Tasks',
    [StringTemplates.TeamsViewSummaryInbound]: 'Inbound Calls',
    [StringTemplates.TeamsViewSummaryOutbound]: 'Outbound Calls',
    [StringTemplates.TeamsViewSummaryTotalAgents]: 'Total Agents',
    [StringTemplates.StatusIdleLabel]: 'Idle',
    [StringTemplates.StatusIdleTooltip]: 'Idle: Available with no Tasks',
    [StringTemplates.StatusBusyLabel]: 'Busy',
    [StringTemplates.StatusBusyTooltip]: 'Busy: Available with Task(s)',
  },
  'es-MX': esMX,
});
