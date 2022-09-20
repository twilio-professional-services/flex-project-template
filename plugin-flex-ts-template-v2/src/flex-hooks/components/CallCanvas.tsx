import * as Flex from '@twilio/flex-ui';
import { addConferenceToCallCanvas } from '../../feature-library/conference/flex-hooks/components/CallCanvas';
import { addSupervisorCoachingPanelToAgent } from '../../feature-library/supervisor-barge-coach/flex-hooks/components/CallCanvas';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addConferenceToCallCanvas(flex);
  addSupervisorCoachingPanelToAgent(flex, manager);
}

