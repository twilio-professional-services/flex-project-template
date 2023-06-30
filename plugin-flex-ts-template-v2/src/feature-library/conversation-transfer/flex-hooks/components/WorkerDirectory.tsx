import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.WorkerDirectory;
export const componentHook = function removeDialpadForConvTransfer(flex: typeof Flex, _manager: Flex.Manager) {
  // remove existing dialpad tab
  flex.WorkerDirectory.Tabs.Content.remove('directory', {
    if: ({ task }) => task && Flex.TaskHelper.isCBMTask(task),
  });
};
