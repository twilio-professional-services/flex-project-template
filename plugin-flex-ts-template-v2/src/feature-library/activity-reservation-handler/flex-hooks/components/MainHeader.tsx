import * as Flex from '@twilio/flex-ui';

import PendingActivityComponent from '../../custom-components/pending-activity';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function addPendingActivityComponent(flex: typeof Flex, _manager: Flex.Manager) {
  flex.MainHeader.Content.add(<PendingActivityComponent key="pending-activity" />, {
    sortOrder: -999,
    align: 'end',
  });
};
