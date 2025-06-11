import * as Flex from '@twilio/flex-ui';
import { Manager } from '@twilio/flex-ui';

import { FlexHelper } from '../helpers';
import logger from '../logger';
import Destination from '../logger/destination';
import Console from '../logger/Console';

/**
 * Interface for logger hook objects
 */
interface LoggerHook {
  loggerHook: (flex: typeof Flex, manager: Flex.Manager) => Destination;
}

/**
 * Add a logger hook
 * @param flex - The Flex object
 * @param manager - The Flex Manager instance
 * @param name - The name of the hook
 * @param hook - The hook object containing the loggerHook function
 */
export const addHook = (flex: typeof Flex, manager: Flex.Manager, name: string, hook: LoggerHook): void => {
  console.info(`Feature ${name} registered logger hook: ${hook.loggerHook.name}`);
  
  if (typeof hook.loggerHook === 'function') {
    const destination = hook.loggerHook(flex, manager);
    if (destination instanceof Destination) {
      logger.addDestination(destination);
    }
  }
};

/**
 * Initialize the logger
 * @param manager - The Flex Manager instance
 */
export const init = (_manager: Flex.Manager): void => {
  initLogger();
};

/**
 * Initialize the logger with metadata and event listeners
 */
export const initLogger = (): void => {
  // Use Console instead of abstract Destination class
  logger.addDestination(new Console({ minLogLevel: 'debug', metaData: null }));

  // Add plugin metadata
  if (process.env.REACT_APP_PLUGIN_NAME) {
    logger.addMetaData('pluginName', process.env.REACT_APP_PLUGIN_NAME);
  }
  
  if (process.env.REACT_APP_VERSION) {
    logger.addMetaData('pluginVersion', process.env.REACT_APP_VERSION);
  }

  // Add task metadata when a task is accepted
  Flex.Actions.addListener('afterAcceptTask', (payload) => {
    if (payload.task) {
      logger.addMetaData('taskSid', payload.task.taskSid);
      logger.addMetaData('taskChannelUniqueName', payload.task.taskChannelUniqueName);
    }
  });

  // Add worker metadata
  const worker = FlexHelper.getCurrentWorker();
  if (worker) {
    logger.addMetaData('workerSid', worker.sid);
    logger.addMetaData('workerName', worker.name);
  }
};
