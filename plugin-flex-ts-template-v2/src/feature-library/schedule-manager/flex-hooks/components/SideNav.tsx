import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { canShowScheduleManager } from '../../utils/schedule-manager';
import ScheduleSideLink from '../../custom-components/ScheduleSideLink/ScheduleSideLink';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addScheduleManagerToSideNav(flex: typeof Flex, manager: Flex.Manager) {
  if (!canShowScheduleManager(manager)) {
    return;
  }

  // Add side nav button for the view
  flex.SideNav.Content.add(<ScheduleSideLink viewName="schedule-manager" key="schedule-manager-side-nav" />);
};
