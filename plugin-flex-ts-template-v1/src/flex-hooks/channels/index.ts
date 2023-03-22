import * as Flex from '@twilio/flex-ui';
import { createCallbackChannel } from '../../feature-library/callback-and-voicemail/flex-hooks/channels/Callback';
import { createVoicemailChannel } from '../../feature-library/callback-and-voicemail/flex-hooks/channels/Voicemail';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  createCallbackChannel(flex, manager);
  createVoicemailChannel(flex, manager);
};
