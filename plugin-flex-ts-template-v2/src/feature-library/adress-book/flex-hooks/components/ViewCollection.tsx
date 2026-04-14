import * as Flex from '@twilio/flex-ui';

import AddressBookView from '../../custom-components/AddressBookView';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addAddressBookView(flex: typeof Flex, _manager: Flex.Manager) {
  flex.ViewCollection.Content.add(
    <flex.View name="address-book" key="address-book-view">
      <AddressBookView key="address-book-view-content" />
    </flex.View>,
  );
};
