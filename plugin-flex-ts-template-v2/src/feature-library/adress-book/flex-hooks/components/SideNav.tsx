import * as Flex from '@twilio/flex-ui';

import AddressBookSideLink from '../../custom-components/AddressBookSideLink';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addAddressBookToSideNav(flex: typeof Flex, _manager: Flex.Manager) {
  flex.SideNav.Content.add(<AddressBookSideLink viewName="address-book" key="address-book-side-nav" />);
};
