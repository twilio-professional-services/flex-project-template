import * as Flex from '@twilio/flex-ui';
import { addConferenceToParticipantCanvas } from '../../feature-library/conference/flex-hooks/components/ParticipantCanvas';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addConferenceToParticipantCanvas(flex);
}