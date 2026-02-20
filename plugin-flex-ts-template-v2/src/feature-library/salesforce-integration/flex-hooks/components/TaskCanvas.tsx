import * as Flex from '@twilio/flex-ui';

import AssociateRecordDropdown from '../../custom-components/AssociateRecordDropdown';
import { FlexComponent } from '../../../../types/feature-loader';
import { isActivityLoggingEnabled, isScreenPopEnabled } from '../../config';
import { isSalesforce, getSfdcBaseUrl } from '../../utils/SfdcHelper';

export const componentName = FlexComponent.TaskCanvas;
export const componentHook = function addAsssociateRecordDropdownToCanvas(flex: typeof Flex) {
  if (!isActivityLoggingEnabled() || !isScreenPopEnabled() || !isSalesforce(getSfdcBaseUrl())) {
    return;
  }
  flex.TaskCanvas.Content.add(<AssociateRecordDropdown key="associate-record-dropdown" />, {
    sortOrder: 1,
  });
};
