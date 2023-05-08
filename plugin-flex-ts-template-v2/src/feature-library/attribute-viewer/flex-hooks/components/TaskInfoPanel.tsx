import * as Flex from '@twilio/flex-ui';

import TaskAttributes from '../../custom-components/TaskAttributes';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskInfoPanel;
export const componentHook = function addAttributesToTaskInfoPanel(flex: typeof Flex, _manager: Flex.Manager) {
  flex.TaskInfoPanel.Content.add(<TaskAttributes key="task-attributes" />, {
    sortOrder: 1000,
  });
  flex.Supervisor.TaskInfoPanel.Content.add(<TaskAttributes key="task-attributes-supervisor" />, {
    sortOrder: 1000,
  });
};
