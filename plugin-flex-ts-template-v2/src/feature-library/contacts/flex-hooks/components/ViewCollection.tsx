import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isRecentsEnabled, isPersonalDirectoryEnabled, isSharedDirectoryEnabled } from '../../config';
import ContactsView from '../../custom-components/ContactsView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addContactsView(flex: typeof Flex) {
  if (!isRecentsEnabled() && !isPersonalDirectoryEnabled() && !isSharedDirectoryEnabled()) {
    return;
  }

  flex.ViewCollection.Content.add(
    <flex.View name="contacts" key="contacts-view">
      <ContactsView key="contacts-view-content" />
    </flex.View>,
  );
};
