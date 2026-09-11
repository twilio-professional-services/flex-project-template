export interface TargetSelection {
  team?: string;
  department?: string;
  skill?: string;
}

/**
 * Metadata for one skill as configured in the hosted Flex `taskrouter_skills`
 * list. When both `minimum` and `maximum` are numeric, the skill supports a
 * numeric level ranking that gets stored under `worker.attributes.routing.levels`.
 */
export interface SkillDefinition {
  name: string;
  minimum: number | null;
  maximum: number | null;
  multivalue: boolean;
}

/**
 * One skill to add. `level` is only meaningful when the skill's definition has
 * both a min and a max — otherwise it's ignored server-side.
 */
export interface AddSkillMutation {
  name: string;
  level?: number;
}

export interface WorkerRow {
  sid: string;
  friendlyName: string;
  teamName: string | null;
  departmentName: string | null;
  skills: string[];
}

export interface IdentifyResponse {
  success: boolean;
  workers: WorkerRow[];
  count: number;
  targetWorkersExpression: string;
  error?: string;
}

export interface ExecuteRequest {
  team?: string;
  department?: string;
  skill?: string;
  addSkills: AddSkillMutation[];
  removeSkills: string[];
}

export interface ExecuteResponse {
  success: boolean;
  processed: number;
  total: number;
  cancelled: boolean;
  error: string | null;
}

export interface MassUpdateState {
  inProgress: boolean;
  /** Worker SID of the admin that started the run. */
  startedBy: string | null;
  /**
   * `attributes.full_name` from the starter's worker record; null when the
   * lookup failed or the field wasn't present on the worker JSON. The modal
   * prefers this over the raw SID.
   */
  startedByName: string | null;
  startedAt: number | null;
  total: number;
  processed: number;
  cancelled: boolean;
  heartbeatAt: number | null;
  error: string | null;
}
