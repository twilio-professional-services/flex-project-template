import * as Flex from '@twilio/flex-ui';

import AudioRecorder from '../../custom-components/AudioRecorder/AudioRecorder';

export interface OwnProps {
  showRecorder: boolean;
}

export const componentHook = function addSendAudioFile(flex: typeof Flex, _manager: Flex.Manager) {
  const props: OwnProps = {
    showRecorder: false,
  };

  flex.MessageInputV2.Content.add(<AudioRecorder key="audio-recorder-component" {...props} />, {
    sortOrder: -1,
  });
};
