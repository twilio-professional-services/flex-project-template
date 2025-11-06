import { LogLevel } from 'utils/logger';

export default interface DatadogLogIntegrationConfig {
  enabled: boolean;
  log_level: LogLevel;
  api_key: string;
  intake_region: string;
  flush_timeout: number | undefined;
}

export interface DatadogDestinationConfig {
  minLogLevel: LogLevel;
  apiKey: string;
  intakeRegion: string;
  flushTimeout: number | undefined;
}
