import * as Flex from '@twilio/flex-ui';

import CannedResponsesCRM from '../../custom-components/CannedResponsesCRM';
import { FlexActionEvent } from '../../../../types/feature-loader';
import { getUILocation } from '../../config';
import { StringTemplates } from '../strings';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addCannedResponsesToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  if (getUILocation() !== 'CRM') {
    return;
  }

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (
      !payload.task ||
      !Flex.TaskHelper.isChatBasedTask(payload.task) ||
      Flex.TaskHelper.isInWrapupMode(payload.task)
    ) {
      return;
    }

    payload.components = [
      ...payload.components,
      {
        title: (manager.strings as any)[StringTemplates.CannedResponses],
        order: 0,
        component: <CannedResponsesCRM key="canned-responses-crm-container" />,
      },
    ];
  });
};
