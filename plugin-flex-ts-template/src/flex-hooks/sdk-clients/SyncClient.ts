import * as Flex from '@twilio/flex-ui';
import SyncClient from './sync/SyncClient';

interface TokenPayload {
  token: string
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.events.addListener('tokenUpdated', (tokenPayload: TokenPayload) => {
    updateToken(tokenPayload);
  });
};

function updateToken(tokenPayload: TokenPayload) {
  SyncClient.updateToken(tokenPayload.token);
}
