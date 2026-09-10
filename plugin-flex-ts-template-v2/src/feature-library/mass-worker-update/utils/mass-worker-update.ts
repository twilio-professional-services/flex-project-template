import { Manager } from '@twilio/flex-ui';

import { isFeatureEnabled, getStaleHeartbeatMs } from '../config';
import { MassUpdateState, TargetSelection } from '../types/mass-worker-update';

export const canShowMassWorkerUpdate = (manager: Manager): boolean => {
  const { roles } = manager.user;
  return isFeatureEnabled() && roles.indexOf('admin') >= 0;
};

const escapeQuotes = (value: string): string => String(value).replace(/["\\]/g, '');

export const buildTargetExpression = ({ team, department, skill }: TargetSelection): string => {
  const clauses: string[] = [];
  if (team) clauses.push(`team_name == "${escapeQuotes(team)}"`);
  if (department) clauses.push(`department_name == "${escapeQuotes(department)}"`);
  if (skill) clauses.push(`routing.skills HAS "${escapeQuotes(skill)}"`);
  if (clauses.length === 0) {
    throw new Error('At least one filter (team, department, or skill) is required.');
  }
  return clauses.join(' AND ');
};

export const isStateStale = (state: MassUpdateState | null): boolean => {
  if (!state || !state.inProgress || !state.heartbeatAt) return false;
  return Date.now() - state.heartbeatAt > getStaleHeartbeatMs();
};

export const getTeams = (): string[] => {
  const common = (Manager.getInstance().configuration as any)?.custom_data?.common;
  return Array.isArray(common?.teams) ? common.teams : [];
};

export const getDepartments = (): string[] => {
  const common = (Manager.getInstance().configuration as any)?.custom_data?.common;
  return Array.isArray(common?.departments) ? common.departments : [];
};

export const getWorkspaceSkillNames = (): string[] => {
  const skills = (Manager.getInstance().serviceConfiguration as any)?.taskrouter_skills;
  if (!Array.isArray(skills)) return [];
  return skills.map((skill: any) => skill?.name).filter((name: any): name is string => typeof name === 'string');
};
