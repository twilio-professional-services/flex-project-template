import * as Flex from '@twilio/flex-ui';
import { replaceWorkerCanvasProfile } from '../../feature-library/activity-skill-filter/flex-hooks/components/WorkerCanvas';

export default (flex: typeof Flex, manager: Flex.Manager) => {
	replaceWorkerCanvasProfile(flex, manager);
}