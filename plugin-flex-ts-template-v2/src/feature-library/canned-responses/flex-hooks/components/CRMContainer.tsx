import * as Flex from '@twilio/flex-ui';

import CannedResponsesCRM from '../../custom-components/CannedResponsesCRM';
import { FlexComponent } from '../../../../types/feature-loader';
import { getUILocation } from '../../config';

export const componentName = FlexComponent.CRMContainer;
export const componentHook = function addCannedResponsesCRMContainer(flex: typeof Flex, _manager: Flex.Manager) {
  const options: Flex.ContentFragmentProps = {
    if: (props: any) => {
      // In the TaskCanvas, we have access to the task directly.
      // In the AgentDesktopView, we don't, however we have access to all the tasks and the selected one that we could retrieve
      // When completing the task, selectedTaskSid still exist but the task in the map has been removed, so we have to check the size of it
      if (props.task) {
        return Flex.TaskHelper.isChatBasedTask(props.task);
      }
      if (props.selectedTaskSid && props.tasks.size > 0) {
        return Flex.TaskHelper.isChatBasedTask(props.tasks.get(props.selectedTaskSid));
      }
      return false;
    },
    sortOrder: -1,
  };
  if (getUILocation() === 'CRM') {
    flex.CRMContainer.Content.add(<CannedResponsesCRM key="canned-responses-crm-container" />, options);
  }
};
