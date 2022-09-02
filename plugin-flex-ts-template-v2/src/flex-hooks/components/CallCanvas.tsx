import * as Flex from '@twilio/flex-ui';
import { addConferenceToCallCanvas } from '../../feature-library/conference/flex-hooks/components/CallCanvas';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addConferenceToCallCanvas(flex);
}

