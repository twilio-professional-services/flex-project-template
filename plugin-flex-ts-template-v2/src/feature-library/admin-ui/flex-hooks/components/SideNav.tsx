import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { canShowAdminUi } from '../../utils/helpers';
import AdminSideLink from '../../custom-components/AdminSideLink';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addAdminToSideNav(flex: typeof Flex, manager: Flex.Manager) {
  if (!canShowAdminUi(manager)) {
    return;
  }

  // Add side nav button for the view
  flex.SideNav.Content.add(<AdminSideLink viewName="template-admin" key="template-admin-side-nav" />, { align: 'end' });
};
