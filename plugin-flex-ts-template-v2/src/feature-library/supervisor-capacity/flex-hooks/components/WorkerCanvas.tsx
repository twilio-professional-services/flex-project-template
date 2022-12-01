import * as Flex from '@twilio/flex-ui';
import CapacityContainer from '../../custom-components/CapacityContainer';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.supervisor_capacity || {};

export function addCapacityToWorkerCanvas(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;
  
  flex.WorkerCanvas.Content.add(<CapacityContainer key="worker-capacity-container" />);
}
