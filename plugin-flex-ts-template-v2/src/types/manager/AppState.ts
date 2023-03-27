import * as Flex from '@twilio/flex-ui';

import { reduxNamespace } from '../../utils/state';

// Register all component states under the namespace
export default interface AppState {
  flex: Flex.AppState;
  [reduxNamespace]: any;
}
