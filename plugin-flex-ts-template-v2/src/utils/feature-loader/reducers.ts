import * as Flex from '@twilio/flex-ui';
import { combineReducers } from 'redux';

import logger from '../logger';
import { reduxNamespace } from '../state';

let customReducers = {};

export const init = (manager: Flex.Manager) => {
  if (!manager.store.addReducer) {
    // tslint: disable-next-line
    logger.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
    return;
  }
  manager.store.addReducer(reduxNamespace, combineReducers(customReducers));
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  logger.debug(`Feature ${feature} registered reducer hook: ${hook.reducerHook.name}`);
  const reducer = hook.reducerHook(flex, manager);
  customReducers = {
    ...customReducers,
    ...reducer,
  };
};
