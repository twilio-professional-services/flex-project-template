import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import WorkerCanvasTabs from '../../custom-components/WorkerCanvasTabs/WorkerCanvasTabs';

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addWorkerCanvasTabs(flex: typeof Flex, _manager: Flex.Manager) {
  // Remove Agent Details header
  flex.WorkerCanvas.Content.remove('profile-title');
  // Remove Skills Caption and Workerskills
  flex.WorkerCanvas.Content.remove('skills-title');
  flex.WorkerCanvas.Content.remove('skills');
  // Add Workerskills as a Tab
  flex.WorkerCanvas.Content.add(<WorkerCanvasTabs key="worker-canvas-tabs" />);
};
