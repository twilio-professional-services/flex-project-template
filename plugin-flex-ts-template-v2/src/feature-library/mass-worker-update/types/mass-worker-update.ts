export interface TargetSelection {
  team?: string;
  department?: string;
  skill?: string;
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
  addSkills: string[];
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
  startedBy: string | null;
  startedAt: number | null;
  total: number;
  processed: number;
  cancelled: boolean;
  heartbeatAt: number | null;
  error: string | null;
}
