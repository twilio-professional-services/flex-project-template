import * as Flex from '@twilio/flex-ui';

import { canShowScheduleManager } from '../../utils/schedule-manager';
import ScheduleSideLink from '../../custom-components/ScheduleSideLink/ScheduleSideLink';

export const addScheduleManagerToSideNav = (flex: typeof Flex, manager: Flex.Manager) => {
  if (!canShowScheduleManager(manager)) {
    return;
  }
  
  // Add side nav button for the view
  flex.SideNav.Content.add(
    <ScheduleSideLink viewName="schedule-manager" key="schedule-manager-side-nav" />
  );
}
