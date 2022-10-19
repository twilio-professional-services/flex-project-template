import * as Flex from '@twilio/flex-ui';
import CapacityContainer from '../../custom-components/CapacityContainer';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled, filter_teams_view, rules } = custom_data.features.activity_skill_filter;

export function addCapacityToWorkerCanvas(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled || !filter_teams_view || !rules) return;
  
  flex.WorkerCanvas.Content.add(<CapacityContainer key="worker-capacity-container" />);
}
