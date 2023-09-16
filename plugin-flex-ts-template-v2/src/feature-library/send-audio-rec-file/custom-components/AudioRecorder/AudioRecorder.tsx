/* eslint-disable no-negated-condition */
import React from 'react';
import { IconButton } from '@twilio/flex-ui';

import AudioRecorderPanel from '../AudioRecorderPanel';

interface AudioRecorderState {
  showRecorder: boolean;
  lastAudioFile: any;
}

export interface OwnProps {
  showRecorder: boolean;
}

export type Props = OwnProps;

class AudioRecorder extends React.Component<Props, AudioRecorderState> {
  state = {
    showRecorder: this.props.showRecorder,
    lastAudioFile: null,
  };

  dismiss = () => this.setState({ showRecorder: false });

  openHideRecorder = () => {
    if (this.state.showRecorder === false) {
      this.setState({ showRecorder: true });
    } else {
      this.setState({ showRecorder: false });
    }
  };

  // Callback function to update latestAudioFile
  updateLatestAudioFile = (audioFile: any) => {
    this.setState({ lastAudioFile: audioFile });
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
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default AudioRecorder;
