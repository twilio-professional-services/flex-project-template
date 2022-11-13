import * as Flex from '@twilio/flex-ui';
import { applySelectedCallerIdForDialedNumbers } from '../../feature-library/caller-id/flex-hooks/actions/StartOutboundCall';
import { changeWorkerActivityBeforeOutboundCall } from '../../feature-library/activity-reservation-handler/flex-hooks/actions/StartOutboundCall';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeStartOutboundCall(flex, manager);
  //replaceStartOutboundCall(flex, manager);
  //afterStartOutboundCall(flex, manager);
};

function beforeStartOutboundCall(flex: typeof Flex, manager: Flex.Manager) {
  applySelectedCallerIdForDialedNumbers(flex, manager);
  changeWorkerActivityBeforeOutboundCall(flex, manager);
}

// Avoid using replace hook if possible
function replaceStartOutboundCall(flex: typeof Flex, manager: Flex.Manager) {}

function afterStartOutboundCall(flex: typeof Flex, manager: Flex.Manager) {}
