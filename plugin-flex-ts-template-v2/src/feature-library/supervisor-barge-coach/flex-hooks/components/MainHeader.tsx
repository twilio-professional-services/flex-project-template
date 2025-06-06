import * as Flex from '@twilio/flex-ui';

import CoachingStatusMonitor from '../../custom-components/CoachingStatusMonitor';
import SupervisorAlertButton from '../../custom-components/SupervisorAlertButton';
import { isSupervisorAlertToggleEnabled } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function addSupervisorAlert(flex: typeof Flex, manager: Flex.Manager) {
  const myWorkerRoles = manager.store.getState().flex?.worker?.worker?.attributes?.roles;
  // Update the role names if you wish to include this feature for more role types
  if (myWorkerRoles?.includes('supervisor') || myWorkerRoles?.includes('admin')) {
    flex.MainHeader.Content.add(<CoachingStatusMonitor key="coaching-status-monitor" />);

    if (!isSupervisorAlertToggleEnabled()) return;
    flex.MainHeader.Content.add(<SupervisorAlertButton key="agent-assistance-button" />, {
      sortOrder: -1,
      align: 'end',
    });
  }
};
