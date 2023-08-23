import * as Flex from '@twilio/flex-ui';

import { getFeatureFlags } from '../../../utils/configuration';

class AudioPlayerManagerHelper {
  _mediaId: string | undefined;

  play = (): void => {
    const custom_data = getFeatureFlags() || {};
    this._mediaId = Flex.AudioPlayerManager.play({
      url: `https://${custom_data.serverless_functions_domain}/features/ring-notification/phone_ringing.mp3`,
      repeatable: true,
    });
  };

  stop = (): void => {
    if (this._mediaId) {
      Flex.AudioPlayerManager.stop(this._mediaId);
    }
  };
}

const AudioPlayerManagerHelperSingleton = new AudioPlayerManagerHelper();

export default AudioPlayerManagerHelperSingleton;
