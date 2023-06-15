import * as Flex from '@twilio/flex-ui';

import SideNavigationIcon from '../../custom-components/SideNavigation/SideNavigationIcon';
import { FlexComponent } from '../../../../types/feature-loader';
import { isSupported } from '../../utils/KeyboardShortcutsUtil';

export const componentName = FlexComponent.SideNav;
export const componentHook = function KeyboardSideNav(_manager: Flex.Manager) {
  if (!isSupported()) {
    console.error(
      'The keyboard-shortcuts feature is not supported in versions of Flex UI prior to 2.1. Please upgrade to use this feature.',
    );
    return;
  }
  Flex.SideNav.Content.add(<SideNavigationIcon key="keyboard-shortcuts-side-nav" viewName="keyboard-shortcuts" />, {
    sortOrder: 100,
  });
};
