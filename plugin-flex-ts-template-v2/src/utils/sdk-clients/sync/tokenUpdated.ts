import * as Flex from '@twilio/flex-ui';
import { SSOTokenPayload } from '@twilio/flex-ui/src/core/TokenStorage';

import SyncClient from './SyncClient';
import { FlexEvent } from '../../../types/feature-loader';

export const eventName = FlexEvent.tokenUpdated;
export const eventHook = (_flex: typeof Flex, _manager: Flex.Manager, tokenPayload: SSOTokenPayload) => {
  updateToken(tokenPayload);
};

function updateToken(tokenPayload: SSOTokenPayload) {
  SyncClient.updateToken(tokenPayload.token);
}
