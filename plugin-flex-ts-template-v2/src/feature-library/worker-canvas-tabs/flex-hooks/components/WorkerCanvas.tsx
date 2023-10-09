import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import WorkerCanvasTabs from '../../custom-components/WorkerCanvasTabs/WorkerCanvasTabs';

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addWorkerCanvasTabs(flex: typeof Flex, _manager: Flex.Manager) {
  flex.WorkerCanvas.Content.add(<WorkerCanvasTabs key="worker-canvas-tabs" />);
};
