import * as Flex from '@twilio/flex-ui';
import { createCallbackChannel } from '../../feature-library/callbacks/flex-hooks/channels/Callback';
import { createVoicemailChannel } from '../../feature-library/callbacks/flex-hooks/channels/Voicemail';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  createCallbackChannel(flex, manager);
  createVoicemailChannel(flex, manager);
};
