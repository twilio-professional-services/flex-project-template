import * as Flex from '@twilio/flex-ui';
import { addConferenceToCallCanvasActions } from '../../feature-library/conference/flex-hooks/components/CallCanvasActions';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addConferenceToCallCanvasActions(flex);
}

