import * as Flex from '@twilio/flex-ui';

import SideNavigationIcon from '../../custom-components/SideNavigation/SideNavigationIcon';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.SideNav;
export const componentHook = function KeyboardSideNav(flex: typeof Flex, _manager: Flex.Manager) {
  Flex.SideNav.Content.add(<SideNavigationIcon key="keyboard-shortcuts-side-nav" viewName="keyboard-shortcuts" />, {
    sortOrder: 100,
  });
};
