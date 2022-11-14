import * as Flex from '@twilio/flex-ui';
import { enableBargeCoachButtonsUponMonitor, disableBargeCoachButtonsUponMonitor } from '../../feature-library/supervisor-barge-coach/flex-hooks/actions/MonitorCall'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  beforeMonitorCall(flex, manager);
  //replaceMonitorCall(flex, manager);
  afterStopMonitoringCall(flex, manager);
}

function beforeMonitorCall(flex: typeof Flex, manager: Flex.Manager) {
  enableBargeCoachButtonsUponMonitor(flex, manager);
}

// Avoid using replace hook if possible
function replaceMonitorCall(flex: typeof Flex, manager: Flex.Manager) {
}

function afterStopMonitoringCall(flex: typeof Flex, manager: Flex.Manager) {
  disableBargeCoachButtonsUponMonitor(flex, manager);
}
