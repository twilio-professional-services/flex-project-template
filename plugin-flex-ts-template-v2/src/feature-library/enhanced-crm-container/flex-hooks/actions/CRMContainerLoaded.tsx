import * as Flex from '@twilio/flex-ui';

import IFrameCRMTab from '../../custom-components/IFrameCRMTab';
import { FlexActionEvent } from '../../../../types/feature-loader';
import { shouldDisplayUrlWhenNoTasks, getUrlTabTitle, isUrlTabEnabled } from '../../config';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addURLTabToEnhancedCRM(flex: typeof Flex) {
  if (!isUrlTabEnabled()) {
    return;
  }
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!payload.task && !shouldDisplayUrlWhenNoTasks()) {
      return;
    }

    payload.components = [
      ...payload.components,
      { title: getUrlTabTitle(), component: <IFrameCRMTab task={payload.task} key="iframe-crm-container" /> },
    ];
  });
};
