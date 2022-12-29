import * as Flex from '@twilio/flex-ui';
import CapacityContainer from '../../custom-components/CapacityContainer';
import { isFeatureEnabled } from '../..';

export function addCapacityToWorkerCanvas(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!isFeatureEnabled()) return;
  
  flex.WorkerCanvas.Content.add(<CapacityContainer key="worker-capacity-container" />);
}
