import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { canShowMassWorkerUpdate } from '../../utils/mass-worker-update';
import MassWorkerUpdateSideLink from '../../custom-components/MassWorkerUpdateSideLink/MassWorkerUpdateSideLink';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addMassWorkerUpdateToSideNav(flex: typeof Flex, manager: Flex.Manager) {
  if (!canShowMassWorkerUpdate(manager)) {
    return;
  }

  flex.SideNav.Content.add(
    <MassWorkerUpdateSideLink viewName="mass-worker-update" key="mass-worker-update-side-nav" />,
  );
};
