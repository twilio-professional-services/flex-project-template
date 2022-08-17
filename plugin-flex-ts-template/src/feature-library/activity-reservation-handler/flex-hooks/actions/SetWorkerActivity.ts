import * as Flex from '@twilio/flex-ui';
import FlexState from '../states/FlexState';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { delayActivityChange, systemActivities } from '../../utils/WorkerActivities';
import { FlexNotification } from '../../utils/enums';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.activity_reservation_handler;

export function beforeSetActivity(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener('beforeSetActivity', (payload, abortFunction) => {
    const { activityName, activitySid, isInvokedByPlugin } = payload;

    if (isInvokedByPlugin) {
      // We will allow any worker activity change invoked by the plugin to
      // proceed as normal
      return;
    }

    if (systemActivities.map((a) => a.toLowerCase()).includes(activityName.toLowerCase())) {
      abortFunction();
      flex.Notifications.showNotification(FlexNotification.restrictedActivities, {
        activityName,
      });
    } else if (FlexState.hasActiveCallTask || FlexState.hasWrappingTask) {
      abortFunction();
      const targetActivity = FlexState.getActivityBySid(activitySid);
      delayActivityChange(flex, targetActivity);
    }
  });
}
