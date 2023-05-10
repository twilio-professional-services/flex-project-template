import * as Flex from '@twilio/flex-ui';

import WorkerAttributes from '../../custom-components/WorkerAttributes';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addAttributesToWorkerCanvas(flex: typeof Flex, _manager: Flex.Manager) {
  flex.WorkerCanvas.Content.add(<WorkerAttributes key="worker-attributes" />, {
    sortOrder: 1000,
  });
};
