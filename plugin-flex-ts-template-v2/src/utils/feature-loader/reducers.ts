import * as Flex from '@twilio/flex-ui';
import { combineReducers, Reducer, AnyAction } from 'redux';

import { reduxNamespace } from '../state';

let customReducers: Record<string, Reducer<any, AnyAction>> = {};

export const init = (manager: Flex.Manager) => {
  if (!manager.store.addReducer) {
    // tslint: disable-next-line
    console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
    return;
  }

  // Only add reducer if there are custom reducers to combine
  if (Object.keys(customReducers).length > 0) {
    manager.store.addReducer(reduxNamespace, combineReducers(customReducers));
  }
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered reducer hook: %c${hook.reducerHook.name}`, 'font-weight:bold');
  const reducer = hook.reducerHook(flex, manager);
  customReducers = {
    ...customReducers,
    ...reducer,
  };
};
