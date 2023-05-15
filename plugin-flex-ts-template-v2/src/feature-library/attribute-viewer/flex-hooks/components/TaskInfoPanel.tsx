import * as Flex from '@twilio/flex-ui';

import TaskAttributes from '../../custom-components/TaskAttributes';
import { FlexComponent } from '../../../../types/feature-loader';
import { isEnabledForAgents } from '../../config';

export const componentName = FlexComponent.TaskInfoPanel;
export const componentHook = function addAttributesToTaskInfoPanel(flex: typeof Flex, manager: Flex.Manager) {
  const { roles } = manager.user;
  if (!isEnabledForAgents() && roles.indexOf('admin') < 0 && roles.indexOf('supervisor') < 0) return;

  flex.TaskInfoPanel.Content.add(<TaskAttributes key="task-attributes" />, {
    sortOrder: 1000,
  });
  flex.Supervisor.TaskInfoPanel.Content.add(<TaskAttributes key="task-attributes-supervisor" />, {
    sortOrder: 1000,
  });
};
