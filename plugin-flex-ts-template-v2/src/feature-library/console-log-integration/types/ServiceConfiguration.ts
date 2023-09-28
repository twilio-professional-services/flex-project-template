import { LogLevel } from 'utils/logger';

export default interface ConsoleLogIntegrationConfig {
  enabled: boolean;
  log_level: LogLevel;
}
