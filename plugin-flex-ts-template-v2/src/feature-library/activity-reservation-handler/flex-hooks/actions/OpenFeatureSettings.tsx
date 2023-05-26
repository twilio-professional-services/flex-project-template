import * as Flex from '@twilio/flex-ui';

import ActivityHandlerAdmin from '../../custom-components/ActivityHandlerAdmin/ActivityHandlerAdmin';
import { FlexActionEvent } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'OpenFeatureSettings';
export const actionHook = function addAdminComponent(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    if (payload.feature !== 'activity_reservation_handler') return;
    payload.component = <ActivityHandlerAdmin {...payload} />;
    payload.hideDefaultComponents = true;
  });
};
