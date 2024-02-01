/* eslint-disable no-negated-condition */
import React from 'react';
import { IconButton } from '@twilio/flex-ui';

import AudioRecorderPanel from '../AudioRecorderPanel';

class AudioRecorder extends React.Component {
  state = {
    showRecorder: false,
    lastAudioFile: null,
    blobURL: '',
  };

  dismiss = () => this.setState({ showRecorder: false });

  openHideRecorder = () => {
    if (this.state.showRecorder === false) {
      this.setState({ showRecorder: true });
    } else {
      this.setState({ showRecorder: false });
    }
  };

  // Callback function to update latestAudioFile and blobURL
  updateLatestAudioFile = (audioFile: any, blobURL: any) => {
    this.setState({ lastAudioFile: audioFile, blobURL });
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
            blobURL={this.state.blobURL}
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default AudioRecorder;
