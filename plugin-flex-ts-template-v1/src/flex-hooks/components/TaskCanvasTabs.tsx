import * as Flex from '@twilio/flex-ui';
import { addSupervisorMonitorPanel } from '../../feature-library/supervisor-barge-coach/flex-hooks/components/TaskCanvasTabs'

export default (flex: typeof Flex, manager: Flex.Manager) => {

    addSupervisorMonitorPanel(flex, manager);

}
