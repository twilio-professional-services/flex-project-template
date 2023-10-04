import Datadog from '../../destination/Datadog';
import { getLogLevel, getApiKey, getIntakeRegion, getFlushTimeout } from '../../config';

export const loggerHook = () => {
  return new Datadog({
    apiKey: getApiKey(),
    intakeRegion: getIntakeRegion(),
    flushTimeout: getFlushTimeout(),
    minLogLevel: getLogLevel(),
  });
};
