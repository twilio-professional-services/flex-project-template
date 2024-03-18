import * as Flex from '@twilio/flex-ui';

import { supervisorBrowserRefresh } from '../../helpers/browserRefreshHelper';
import SupervisorChatBargeButton from '../../custom-components/ChatBargeButton';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addSupervisorBargeCoachButtons(flex: typeof Flex, _manager: Flex.Manager) {
  supervisorBrowserRefresh();

  // Add Chat Barge Button
  flex.Supervisor.TaskCanvasHeader.Content.add(<SupervisorChatBargeButton key="SupervisorChatBarge" />, {
    if: (props) => props.channelDefinition.capabilities.has('Chat'),
    sortOrder: -1,
  });
};
