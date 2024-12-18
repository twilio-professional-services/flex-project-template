interface AttributesQualificationConfig {
  key: string;
  value: string;
}

export default interface ConditionalRecordingConfig {
  enabled: boolean;
  exclude_attributes: Array<AttributesQualificationConfig>;
  exclude_queues: Array<string>;
}
