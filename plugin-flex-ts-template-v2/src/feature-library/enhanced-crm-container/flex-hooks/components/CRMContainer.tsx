import * as Flex from '@twilio/flex-ui';

import TabbedCRMContainer from '../../custom-components/TabbedCRMContainer';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.CRMContainer;
export const componentHook = function replaceAndSetCustomCRMContainer(flex: typeof Flex, _manager: Flex.Manager) {
  flex.CRMContainer.Content.replace(<TabbedCRMContainer key="custom-crm-container" />, {
    sortOrder: 1,
  });
};
