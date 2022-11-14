import * as Flex from '@twilio/flex-ui';
import { addSupervisorCoachingPanelToAgent } from '../../feature-library/supervisor-barge-coach/flex-hooks/components/CallCanvas'

export default (flex: typeof Flex, manager: Flex.Manager) => {

    addSupervisorCoachingPanelToAgent(flex, manager);

}

