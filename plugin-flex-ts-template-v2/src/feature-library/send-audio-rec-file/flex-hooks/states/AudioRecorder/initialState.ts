import { AudioRecorderState } from './types';

// Set the initial state of the below that we will use to change the last audio
const initialState: AudioRecorderState = {
  showRecorder: false,
  lastAudioFile: null,
  blobURL: '',
};

export default initialState;
