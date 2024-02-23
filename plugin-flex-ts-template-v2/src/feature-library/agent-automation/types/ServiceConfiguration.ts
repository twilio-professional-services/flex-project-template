interface AttributesQualificationConfig {
  key: string;
  value: string;
}

export interface TaskQualificationConfig {
  channel: string;
  auto_select: boolean;
  auto_accept: boolean;
  auto_wrapup: boolean;
  required_attributes: Array<AttributesQualificationConfig>;
  required_worker_attributes: Array<AttributesQualificationConfig>;
  wrapup_time: number;
  default_outcome: string;
  allow_extended_wrapup: boolean;
  extended_wrapup_time: number;
}

export default interface AgentAutomationConfig {
  enabled: boolean;
  configuration: Array<TaskQualificationConfig>;
}
