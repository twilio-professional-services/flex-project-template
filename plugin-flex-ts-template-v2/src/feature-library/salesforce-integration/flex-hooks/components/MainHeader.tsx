import * as Flex from '@twilio/flex-ui';

import StateListener from '../../custom-components/StateListener';
import { FlexComponent } from '../../../../types/feature-loader';
import { isUtilityBarStatusEnabled } from '../../config';
import { isSalesforce, getSfdcBaseUrl } from '../../utils/SfdcHelper';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function addUtilityBarStateListener(flex: typeof Flex) {
  if (!isSalesforce(getSfdcBaseUrl())) {
    // Open CTI isn't loaded yet, so just check that we are embedded within Salesforce
    return;
  }

  // When embedded in Salesforce, there is no room for the logo and it obscures other buttons added to the header.
  flex.MainHeader.Content.remove('logo');

  if (!isUtilityBarStatusEnabled()) {
    return;
  }
  flex.MainHeader.Content.add(<StateListener key="utility-bar-state-listener" />);
};
