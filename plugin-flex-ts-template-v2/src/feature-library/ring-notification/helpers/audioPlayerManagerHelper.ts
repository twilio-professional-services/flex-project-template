import * as Flex from '@twilio/flex-ui';

import { getFeatureFlags } from '../../../utils/configuration';

class AudioPlayerManagerHelper {
  _mediaId: string | undefined;

  play = (): void => {
    const custom_data = getFeatureFlags() || {};
    let domain = `${custom_data.serverless_functions_protocol ?? 'https'}://${custom_data.serverless_functions_domain}`;
    if (custom_data.serverless_functions_port) domain += `:${custom_data.serverless_functions_port}`;
    if (this._mediaId) {
      // AudioPlayerManager supports playing one media at a time, and we already are playing something. If we try to play more, it will get queued and potentially play indefinitely.
      return;
    }
    this._mediaId = Flex.AudioPlayerManager.play({
      url: `${domain}/features/ring-notification/phone_ringing.mp3`,
      repeatable: true,
    });
  };

  stop = (): void => {
    if (this._mediaId) {
      Flex.AudioPlayerManager.stop(this._mediaId);
      this._mediaId = undefined;
    }
  };
}

const AudioPlayerManagerHelperSingleton = new AudioPlayerManagerHelper();

export default AudioPlayerManagerHelperSingleton;
