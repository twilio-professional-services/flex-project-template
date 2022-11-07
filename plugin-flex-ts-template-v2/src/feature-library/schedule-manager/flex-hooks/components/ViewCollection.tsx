import * as Flex from '@twilio/flex-ui';

import { canShowScheduleManager } from '../../utils/schedule-manager';
import ScheduleView from '../../custom-components/ScheduleView/ScheduleView';

export const addScheduleManagerView =  (flex: typeof Flex, manager: Flex.Manager) => {
  if (!canShowScheduleManager(manager)) {
    return;
  }
  
  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="schedule-manager" key="schedule-manager-view">
      <ScheduleView key="schedule-manager-view-content" />
    </flex.View>
  );
}
