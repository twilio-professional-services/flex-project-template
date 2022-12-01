import * as Flex from '@twilio/flex-ui';
import PendingActivityComponent from '../../custom-components/pending-activity';

import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.activity_reservation_handler || {};

export function addPendingActivityComponent(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  flex.MainHeader.Content.add(<PendingActivityComponent key="pending-activity" />, {
    sortOrder: -999,
    align: 'end',
  });
}
