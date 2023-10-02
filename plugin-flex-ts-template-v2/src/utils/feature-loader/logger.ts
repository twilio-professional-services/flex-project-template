import FlexHelperSingleton from '../flex-helper';
import logger from '../logger';
import Destination from '../logger/destination';

const destinations: Destination[] = [];

export const init = () => {
  const worker = FlexHelperSingleton.getCurrentWorker();
  if (worker) {
    logger.addMetaData('workerSid', worker.sid);
    logger.addMetaData('workerName', worker.name);
    logger.addMetaData('source', 'twilio:flex-ui');
  }
  destinations.forEach((dest) => logger.addDestination(dest));
  logger.processBuffer();
};

export const addHook = (feature: string, hook: any) => {
  if (!hook.loggerHook) {
    logger.warn(`Feature ${feature} declared logger hook, but is missing loggerHook to hook`);
    return;
  }
  console.info(`Feature ${feature} registered logger hook: %c${typeof hook.loggerHook}`, 'font-weight:bold');
  destinations.push(hook.loggerHook());
};
