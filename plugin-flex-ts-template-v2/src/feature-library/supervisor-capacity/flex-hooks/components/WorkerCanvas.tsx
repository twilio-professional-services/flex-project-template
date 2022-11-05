import * as Flex from '@twilio/flex-ui';
import CapacityContainer from '../../custom-components/CapacityContainer';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes || {};
const { enabled = false } = custom_data?.features?.supervisor_capacity || {};

export function addCapacityToWorkerCanvas(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;
  
  flex.WorkerCanvas.Content.add(<CapacityContainer key="worker-capacity-container" />);
}
