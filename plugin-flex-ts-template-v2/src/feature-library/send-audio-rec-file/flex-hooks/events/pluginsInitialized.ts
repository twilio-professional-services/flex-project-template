import SimpleAudioRecorder from 'simple-audio-recorder';

import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function preloadAudioWorker() {
  SimpleAudioRecorder.preload('https://cdn.jsdelivr.net/npm/simple-audio-recorder@1.2.3/dist/mp3worker.js');
};
