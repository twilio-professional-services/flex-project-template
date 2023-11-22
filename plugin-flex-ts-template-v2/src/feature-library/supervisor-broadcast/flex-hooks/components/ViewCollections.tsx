import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import SupervisorBroadcastView from '../../custom-components/SupervisorBroadcastView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addSupervisorBroadcastView(flex: typeof Flex, manager: Flex.Manager) {
  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="supervisor-broadcast" key="supervisor-broadcast-view">
      <SupervisorBroadcastView key="supervisor-broadcast-view-content" />
    </flex.View>,
  );
};
