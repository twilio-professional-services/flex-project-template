import * as Flex from '@twilio/flex-ui';
import NoTasksCanvasAvailabilityComponent from '../../custom-components/no-tasks-canvas-availability/'
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled, rules } = custom_data.features.activity_skill_filter;

export function replaceAvailability(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled || !rules) return;
  
  flex.NoTasksCanvas.Content.remove('availability');
  flex.NoTasksCanvas.Content.add(
	  <NoTasksCanvasAvailabilityComponent key='no-task-canvas-availability' />
  );
}
