import * as Flex from '@twilio/flex-ui';

import CapacityContainer from '../../custom-components/CapacityContainer';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addCapacityToWorkerCanvas(flex: typeof Flex, _manager: Flex.Manager) {
  flex.WorkerCanvas.Content.add(<CapacityContainer key="worker-capacity-container" />);
};
