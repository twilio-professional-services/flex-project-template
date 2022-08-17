import * as Flex from '@twilio/flex-ui';
import { beforeSetActivity } from '../../feature-library/activity-reservation-handler/flex-hooks/actions/SetWorkerActivity';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeSetWorkerActivity(flex, manager);
  //replaceSetWorkerActivity(flex, manager);
  //afterSetWorkerActivity(flex, manager);
};

function beforeSetWorkerActivity(flex: typeof Flex, manager: Flex.Manager) {
  beforeSetActivity(flex, manager);
}

// Avoid using replace hook if possible
function replaceSetWorkerActivity(flex: typeof Flex, manager: Flex.Manager) {}

function afterSetWorkerActivity(flex: typeof Flex, manager: Flex.Manager) {}
