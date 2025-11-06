import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import ParkView from '../../custom-components/ParkView/ParkView';
import { isListEnabled } from '../../config';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addParkInteractionView(flex: typeof Flex) {
  if (!isListEnabled()) {
    return;
  }

  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="park-interaction" key="park-interaction-view">
      <ParkView key="park-interaction-view-content" />
    </flex.View>,
  );
};
