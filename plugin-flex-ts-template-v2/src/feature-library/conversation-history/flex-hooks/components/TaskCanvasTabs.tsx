import * as Flex from '@twilio/flex-ui';

import ConversationHistory from '../../custom-components/ConversationHistory';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addConversationHistoryTab(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasTabs.Content.add(
    <flex.Tab key="history" uniqueName="history" label="History">
      <ConversationHistory key="conversation-history-tab" />
    </flex.Tab>,
    {
      if: ({ task }) => task && flex.TaskHelper.isCBMTask(task),
    },
  );
};
