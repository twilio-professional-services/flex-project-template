interface TaskAttributesQualificationConfig {
  key: string;
  value: string;
}

export interface TaskQualificationConfig {
  channel: string;
  auto_select: boolean;
  auto_accept: boolean;
  auto_wrapup: boolean;
  required_attributes: Array<TaskAttributesQualificationConfig>;
  wrapup_time: number;
  default_outcome: string;
}

export default interface AgentAutomationConfig {
  enabled: boolean;
  configuration: Array<TaskQualificationConfig>;
}
