import * as Flex from '@twilio/flex-ui';
import mergeWith from 'lodash/mergeWith';
import unset from 'lodash/unset';

import { AppState } from '../src/types/manager';
import { reduxNamespace } from '../src/utils/state';

// NOTE: Not sure a great way to "set" the Flex redux store value
//       So the __mocks__/@twilio/flex-ui.js file will use this variable as value
//       And tests can use these functions to set value (will automatically get reset after each test)
let mockedReduxState: AppState = {
  flex: {} as Flex.AppState,
  [reduxNamespace]: {} as AppState[typeof reduxNamespace],
};

export const getMockedReduxState = () => mockedReduxState;
export const resetReduxState = () => {
  mockedReduxState = {
    flex: {} as Flex.AppState,
    [reduxNamespace]: {} as AppState[typeof reduxNamespace],
  };
};
export const setFlexReduxState = (appState: Partial<Flex.AppState>) => {
  mergeWith(mockedReduxState, { flex: appState }, (_objValue, srcValue, key, obj) => {
    if (srcValue === undefined) {
      unset(obj, key);
    }
  });
};
export const setCustomReduxState = (appState: Partial<AppState[typeof reduxNamespace]>) => {
  mergeWith(mockedReduxState, { [reduxNamespace]: appState }, (_objValue, srcValue, key, obj) => {
    if (srcValue === undefined) {
      unset(obj, key);
    }
  });
};
