import * as Flex from '@twilio/flex-ui';
import { addSupervisorBargeCoachButtons } from '../../feature-library/supervisor-barge-coach/flex-hooks/components/TaskOverviewCanvas'

export default (flex: typeof Flex, manager: Flex.Manager) => {

    addSupervisorBargeCoachButtons(flex, manager);

}

