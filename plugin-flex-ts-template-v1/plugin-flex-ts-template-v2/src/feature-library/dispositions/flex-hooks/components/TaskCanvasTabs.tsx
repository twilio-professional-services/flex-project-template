import * as Flex from '@twilio/flex-ui';

import DispositionTab from '../../custom-components/DispositionTab';
import { FlexComponent } from '../../../../types/feature-loader';
import { getDispositionsForQueue, isNotesEnabled } from '../../config';
import { StringTemplates } from '../strings';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addDispositionTab(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab
      key="disposition"
      uniqueName="disposition"
      label={(manager.strings as any)[StringTemplates.DispositionTab]}
    >
      <DispositionTab key="disposition-tab-content" />
    </Flex.Tab>,
    {
      sortOrder: 1000,
      if: ({ task }) =>
        (getDispositionsForQueue(task?.queueSid ?? '').length > 0 || isNotesEnabled()) &&
        (Flex.TaskHelper.isTaskAccepted(task) || Flex.TaskHelper.isInWrapupMode(task)),
    },
  );
};
