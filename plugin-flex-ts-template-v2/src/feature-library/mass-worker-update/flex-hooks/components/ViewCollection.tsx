import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { canShowMassWorkerUpdate } from '../../utils/mass-worker-update';
import MassWorkerUpdateView from '../../custom-components/MassWorkerUpdateView/MassWorkerUpdateView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addMassWorkerUpdateView(flex: typeof Flex, manager: Flex.Manager) {
  if (!canShowMassWorkerUpdate(manager)) {
    return;
  }

  flex.ViewCollection.Content.add(
    <flex.View name="mass-worker-update" key="mass-worker-update-view">
      <MassWorkerUpdateView key="mass-worker-update-view-content" />
    </flex.View>,
  );
};
