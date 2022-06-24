import * as Flex from '@twilio/flex-ui';
import { replaceAvailability } from '../../feature-library/activity-skill-filter/flex-hooks/components/NoTasksCanvas';

export default (flex: typeof Flex, manager: Flex.Manager) => {
	replaceAvailability(flex, manager);
}