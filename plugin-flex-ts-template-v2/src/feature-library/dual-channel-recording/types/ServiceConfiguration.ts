interface AttributesQualificationConfig {
  key: string;
  value: string;
}

export default interface DualChannelRecordingConfig {
  enabled: boolean;
  channel: 'customer' | 'worker';
  exclude_attributes: Array<AttributesQualificationConfig>;
  exclude_queues: Array<string>;
}
