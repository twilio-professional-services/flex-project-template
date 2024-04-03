import SimpleAudioRecorder from 'simple-audio-recorder';

import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function preloadAudioWorker() {
  // This URL should be updated whenever the package is updated to a new major version
  SimpleAudioRecorder.preload('https://cdn.jsdelivr.net/npm/simple-audio-recorder@1.2.3/dist/mp3worker.js');
};
