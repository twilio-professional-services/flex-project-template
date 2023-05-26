import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { canShowAdminUi } from '../../utils/helpers';
import AdminView from '../../custom-components/AdminView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addAdminView(flex: typeof Flex, manager: Flex.Manager) {
  if (!canShowAdminUi(manager)) {
    return;
  }

  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="template-admin" key="template-admin-view">
      <AdminView key="template-admin-view-content" />
    </flex.View>,
  );
};
