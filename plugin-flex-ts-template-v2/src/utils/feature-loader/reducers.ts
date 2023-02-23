import * as Flex from "@twilio/flex-ui";
import { combineReducers, Action as ReduxAction } from "redux";

// Register your redux store under a unique namespace
export const reduxNamespace = "custom";

// Extend this payload to be of type that your ReduxAction is
// Normally you'd follow this pattern...https://redux.js.org/recipes/usage-with-typescript#a-practical-example
// But that breaks the typing when adding the reducer to Flex, so no payload intellisense for you!
export interface Action extends ReduxAction {
  payload?: any;
}

// Register all component states under the namespace
export interface AppState {
  flex: Flex.AppState;
  [reduxNamespace]: any;
}

var customReducers = {};

export const init = (manager: Flex.Manager) => {
  if (!manager.store.addReducer) {
    // tslint: disable-next-line
    console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
    return;
  }
  manager.store.addReducer(reduxNamespace, combineReducers(customReducers));
}

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered reducer hook: ${hook.reducerHook.name}`);
  const reducer = hook.reducerHook(flex, manager);
  customReducers = {
    ...customReducers,
    ...reducer
  };
}