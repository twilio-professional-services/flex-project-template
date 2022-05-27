import * as Flex from '@twilio/flex-ui';
import SyncClient from './sync/SyncClient';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.store.getState().flex.session.loginHandler.on('tokenUpdated', () => {
    updateToken(manager);
  });
};

function updateToken(manager: Flex.Manager) {
  const loginHandler = manager.store.getState().flex.session.loginHandler;
  SyncClient.updateToken(loginHandler.getTokenInfo().token);
}
