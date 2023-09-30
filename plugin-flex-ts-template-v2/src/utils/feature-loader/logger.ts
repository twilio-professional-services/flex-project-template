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
  logger.debug('logger initialized!');
};

export const processHooks = () => {
  destinations.forEach((dest) => logger.addDestination(dest));
  logger.processBuffer();
};

export const addHook = (feature: string, hook: any) => {
  if (!hook.loggerHook) {
    logger.warn(`Feature ${feature} declared logger hook, but is missing loggerHook to hook`);
    return;
  }
  destinations.push(hook.loggerHook());
};
