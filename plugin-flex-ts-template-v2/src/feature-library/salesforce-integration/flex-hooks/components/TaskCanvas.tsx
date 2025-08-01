import * as Flex from '@twilio/flex-ui';

import AssociateRecordDropdown from '../../custom-components/AssociateRecordDropdown';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvas;
export const componentHook = function addAsssociateRecordDropdownToCanvas(flex: typeof Flex) {
  flex.TaskCanvas.Content.add(<AssociateRecordDropdown key="associate-record-dropdown" />, {
    sortOrder: 1,
  });
};
