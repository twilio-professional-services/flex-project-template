import * as Flex from '@twilio/flex-ui';
import SyncClient from './SyncClient';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  SyncClient(flex, manager);
}