import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import ParkSideLink from '../../custom-components/ParkSideLink/ParkSideLink';
import { isListEnabled } from '../../config';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addScheduleManagerToSideNav(flex: typeof Flex) {
  if (!isListEnabled()) {
    return;
  }

  // Add side nav button for the view
  flex.SideNav.Content.add(<ParkSideLink viewName="park-interaction" key="park-interaction-side-nav" />);
};
