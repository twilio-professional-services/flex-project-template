import * as Flex from '@twilio/flex-ui';
import PendingActivityComponent from '../../custom-components/pending-activity';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.activity_reservation_handler;

export function addPendingActivityComponent(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  flex.MainHeader.Content.add(<PendingActivityComponent key="pending-activity" />, {
    sortOrder: -999,
    align: 'end',
  });
}
