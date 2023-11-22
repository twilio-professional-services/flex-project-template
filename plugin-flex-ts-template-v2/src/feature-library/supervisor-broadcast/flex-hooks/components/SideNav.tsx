import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import SupervisorBroadcastSideLink from '../../custom-components/SupervisorBroadcastSideLink';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addSupervisorBroadcastToSideNav(flex: typeof Flex, manager: Flex.Manager) {
  // Add side nav button for the view
  flex.SideNav.Content.add(
    <SupervisorBroadcastSideLink viewName="supervisor-broadcast" key="supervisor-broadcast-side-nav" />,
  );
};
