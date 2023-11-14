import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isFeatureEnabled } from '../../config';
import ContactHistorySideLink from './ContactHistorySideLink';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addContactHistoryToSideNav(flex: typeof Flex) {
  if (!isFeatureEnabled()) {
    return;
  }

  flex.SideNav.Content.add(<ContactHistorySideLink viewName="contact-history" key="contact-history-side-nav" />, {
    sortOrder: 1,
  });
};
