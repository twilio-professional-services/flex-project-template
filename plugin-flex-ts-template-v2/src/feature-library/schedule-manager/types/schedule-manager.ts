export interface Rule {
  id: string;
  name: string;
  isOpen: boolean;
  closedReason: string;
  dateRRule: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  name: string;
  manualClose: boolean;
  timeZone: string;
  rules: string[];
  status?: CheckScheduleResponse; // only returned by list-schedules
}

export interface ScheduleManagerConfig {
  data: {
    rules: Rule[];
    schedules: Schedule[];
  };
  version: string;
  versionIsDeployed?: boolean; // only returned by list-schedules
}

export interface UpdateConfigResponse {
  buildSid: string;
  success: boolean;
}

export interface UpdateConfigStatusResponse {
  buildStatus: string;
  success: boolean;
}

export interface PublishConfigRequest {
  buildSid: string;
}

export interface PublishConfigResponse {
  deploymentSid: string;
  success: boolean;
}

export interface CheckScheduleResponse {
  isOpen: boolean;
  closedReason: string;
  error?: string;
}
