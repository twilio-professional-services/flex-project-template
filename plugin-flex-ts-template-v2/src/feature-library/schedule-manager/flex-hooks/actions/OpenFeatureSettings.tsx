import * as Flex from '@twilio/flex-ui';

import ScheduleAdmin from '../../custom-components/ScheduleAdmin/ScheduleAdmin';
import { FlexActionEvent } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'OpenFeatureSettings';
export const actionHook = function addAdminComponent(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    if (payload.feature !== 'schedule_manager') return;
    payload.component = <ScheduleAdmin {...payload} />;
  });
};
