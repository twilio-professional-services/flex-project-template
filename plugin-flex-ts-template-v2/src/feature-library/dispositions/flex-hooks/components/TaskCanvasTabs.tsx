import * as Flex from '@twilio/flex-ui';

import DispositionTab from '../../custom-components/DispositionTab';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addDispositionTab(flex: typeof Flex, manager: Flex.Manager) {
  // TODO: Move label to manager string
  // TODO: Check if no dispositions are configured, and return if so.
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab key="disposition" uniqueName="disposition" label="Disposition">
      <DispositionTab key="disposition-tab-content" />
    </Flex.Tab>,
    {
      sortOrder: 1000,
      if: ({ task }) => Flex.TaskHelper.isTaskAccepted(task) || Flex.TaskHelper.isInWrapupMode(task),
    },
  );
};
