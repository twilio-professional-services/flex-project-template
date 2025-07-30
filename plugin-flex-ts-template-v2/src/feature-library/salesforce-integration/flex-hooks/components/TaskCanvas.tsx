import * as Flex from '@twilio/flex-ui';

import AssociateRecordDropdown from '../../custom-components/AssociateRecordDropdown';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = 'TaskCanvas'; // FlexComponent.TaskCanvas
export const componentHook = function addAsssociateRecordDropdownToCanvas(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvas.Content.add(<AssociateRecordDropdown key="associate-record-dropdown" />, {
    sortOrder: 1,
  });
};
