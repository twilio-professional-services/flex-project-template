import * as Flex from '@twilio/flex-ui';

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

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  if (!hook.loggerHook) {
    logger.warn(`Feature ${feature} declared logger hook, but is missing loggerHook to hook`);
    return;
  }

  console.info(`Feature ${feature} registered logger hook: %c${hook.loggerHook.name}`, 'font-weight:bold');
  destinations.push(hook.loggerHook());
};
