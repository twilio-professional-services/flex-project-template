import { Manager } from '@twilio/flex-ui';

import { isFeatureEnabled, getStaleHeartbeatMs } from '../config';
import { MassUpdateState, SkillDefinition, TargetSelection } from '../types/mass-worker-update';

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

export const getWorkspaceSkills = (): SkillDefinition[] => {
  const skills = (Manager.getInstance().serviceConfiguration as any)?.taskrouter_skills;
  if (!Array.isArray(skills)) return [];
  return skills
    .filter((skill: any) => skill && typeof skill.name === 'string')
    .map((skill: any) => ({
      name: skill.name,
      // `minimum` and `maximum` may be null when the skill has no ranking.
      minimum: typeof skill.minimum === 'number' ? skill.minimum : null,
      maximum: typeof skill.maximum === 'number' ? skill.maximum : null,
      multivalue: Boolean(skill.multivalue),
    }));
};

export const getWorkspaceSkillNames = (): string[] => getWorkspaceSkills().map((skill) => skill.name);

/**
 * A skill has a numeric level ranking iff both `minimum` and `maximum` are
 * configured in the hosted Flex `taskrouter_skills` list.
 */
export const skillHasLevel = (skill: SkillDefinition): boolean =>
  typeof skill.minimum === 'number' && typeof skill.maximum === 'number';
