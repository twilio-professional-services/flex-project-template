import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import PCRSideLink from '../../custom-components/SideLink';
import { canShowAdminUi } from '../../utils/helpers';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addAdminToSideNav(flex: typeof Flex, manager: Flex.Manager) {
  if (!canShowAdminUi(manager)) {
    return;
  }

  // Add side nav button for the view
  flex.SideNav.Content.add(<PCRSideLink viewName="post-call-survey" key="pcr-side-side-nav" />);
};
