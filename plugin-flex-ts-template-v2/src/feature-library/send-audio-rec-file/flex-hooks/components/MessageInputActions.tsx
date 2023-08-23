import * as Flex from '@twilio/flex-ui';

import AudioRecorder from '../../custom-components/AudioRecorder';

export interface OwnProps {
  showRecorder: boolean;
}

export const componentHook = function addSendAudioFile(flex: typeof Flex, _manager: Flex.Manager) {
  const props: OwnProps = {
    showRecorder: false,
  };

  flex.MessageInputActions.Content.add(<AudioRecorder key="send-audio-rec-component" {...props} />, {
    sortOrder: -1,
  });
};
