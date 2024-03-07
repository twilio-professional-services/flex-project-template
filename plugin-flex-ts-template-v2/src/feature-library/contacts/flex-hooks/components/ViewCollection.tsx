import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import ContactsView from '../../custom-components/ContactsView/ContactsView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addContactsView(flex: typeof Flex) {
  flex.ViewCollection.Content.add(
    <flex.View name="contacts" key="contacts-view">
      <ContactsView key="contacts-view-content" />
    </flex.View>,
  );
};
