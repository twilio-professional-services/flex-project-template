import * as Flex from '@twilio/flex-ui';
import WorkerCanvasProfileContainer from '../../custom-components/worker-canvas-profile/'
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled, rules } = custom_data.features.activity_skill_filter;

export function replaceWorkerCanvasProfile(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled || !rules) return;
  
  flex.WorkerCanvas.Content.remove('profile');
  flex.WorkerCanvas.Content.add(
	<WorkerCanvasProfileContainer key="worker-canvas-profile" />,
	{
	  align: 'start',
	  sortOrder: 2
	}
  );
}
