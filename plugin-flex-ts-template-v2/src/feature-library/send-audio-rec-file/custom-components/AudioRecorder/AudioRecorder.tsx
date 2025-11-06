import React from 'react';
import { IconButton } from '@twilio/flex-ui';

import AudioRecorderPanel from '../AudioRecorderPanel';

class AudioRecorder extends React.Component {
  state = {
    showRecorder: false,
    lastAudioFile: null,
    playbackBlobUrl: '',
  };

  dismiss = () => this.setState({ showRecorder: false });

  openHideRecorder = () => {
    if (this.state.showRecorder === false) {
      this.setState({ showRecorder: true });
    } else {
      this.setState({ showRecorder: false });
    }
  };

  // Callback function to update latestAudioFile and playbackBlobUrl
  updateLatestAudioFile = (audioFile: any, playbackBlobUrl: any) => {
    this.setState({ lastAudioFile: audioFile, playbackBlobUrl });
  };

  render() {
    return (
      <div className="Twilio-MessageInputActions-default">
        <IconButton icon="Voice" onClick={this.openHideRecorder} />
        {this.state.showRecorder ? (
          <AudioRecorderPanel
            showRecorder={this.state.showRecorder}
            openHideRecorder={this.openHideRecorder}
            updateLatestAudioFile={this.updateLatestAudioFile}
            lastAudioFile={this.state.lastAudioFile}
            playbackBlobUrl={this.state.playbackBlobUrl}
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default AudioRecorder;
