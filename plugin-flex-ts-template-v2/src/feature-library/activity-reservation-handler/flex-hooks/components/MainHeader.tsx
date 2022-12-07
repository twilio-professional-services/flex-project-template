import * as Flex from '@twilio/flex-ui';
import PendingActivityComponent from '../../custom-components/pending-activity';
import { isFeatureEnabled } from '../..';

export function addPendingActivityComponent(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  flex.MainHeader.Content.add(<PendingActivityComponent key="pending-activity" />, {
    sortOrder: -999,
    align: 'end',
  });
}
