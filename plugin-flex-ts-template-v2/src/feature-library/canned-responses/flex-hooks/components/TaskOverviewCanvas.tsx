import * as Flex from '@twilio/flex-ui';

import CannedResponsesDropdown from '../../custom-components/CannedResponsesDropdown';
import { FlexComponent } from '../../../../types/feature-loader';
import { getUILocation } from '../../../../feature-library/canned-responses/config';

export const componentName = FlexComponent.TaskOverviewCanvas;
export const componentHook = function addCannedResponsesDropdownToTaskOverview(
  flex: typeof Flex,
  _manager: Flex.Manager,
) {
  const options: Flex.ContentFragmentProps = {
    if: (props: any) => {
      // In the TaskCanvas, we have access to the task directly.
      // In the AgentDesktopView, we don't, however we have access to all the tasks and the selected one that we could retrieve
      // When completing the task, selectedTaskSid still exist but the task in the map has been removed, so we have to check the size of it
      if (props.task) {
        return Flex.TaskHelper.isChatBasedTask(props.task);
      } else {
        if (props.selectedTaskSid && props.tasks.size > 0) {
          return Flex.TaskHelper.isChatBasedTask(props.tasks.get(props.selectedTaskSid));
        }
        return false;
      }
    },
    sortOrder: 5,
  };
  if (getUILocation() === 'TaskCanvas') {
    flex.TaskCanvas.Content.add(<CannedResponsesDropdown key="canned-responses-dropdown" />, options);
  }
};
