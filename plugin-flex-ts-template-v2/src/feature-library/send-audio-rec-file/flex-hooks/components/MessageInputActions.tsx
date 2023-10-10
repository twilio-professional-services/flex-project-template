import * as Flex from '@twilio/flex-ui';

import AudioRecorder from '../../custom-components/AudioRecorder';

export const componentHook = function addSendAudioFile(flex: typeof Flex, _manager: Flex.Manager) {
  flex.MessageInputActions.Content.add(<AudioRecorder key="send-audio-rec-component" />, {
    sortOrder: -1,
  });
};
