import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isRecentsEnabled, isPersonalDirectoryEnabled, isSharedDirectoryEnabled } from '../../config';
import ContactsSideLink from '../../custom-components/ContactsSideLink';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addContactsToSideNav(flex: typeof Flex) {
  if (!isRecentsEnabled() && !isPersonalDirectoryEnabled() && !isSharedDirectoryEnabled()) {
    return;
  }

  flex.SideNav.Content.add(<ContactsSideLink viewName="contacts" key="contacts-side-nav" />);
};
