import React from 'react';
import { IconButton } from '@twilio/flex-ui';

import AudioRecorderPanel from '../AudioRecorderPanel';

interface AudioRecorderState {
  showRecorder: boolean;
}

export interface OwnProps {
  showRecorder: boolean;
}

export type Props = OwnProps;

class AudioRecorder extends React.Component<Props, AudioRecorderState> {
  state = {
    showRecorder: this.props.showRecorder,
    isListening: false,
  };

  dismiss = () => this.setState({ showRecorder: false });

  openHideRecorder = () => {
    if (this.state.showRecorder === false) {
      this.setState({ showRecorder: true });
    } else {
      this.setState({ showRecorder: false });
    }
  };

  render() {
    return (
      <div className="Twilio-MessageInputActions-default">
        <IconButton icon="Voice" onClick={this.openHideRecorder} />
        {this.state.showRecorder ? (
          <AudioRecorderPanel showRecorder={this.state.showRecorder} openHideRecorder={this.openHideRecorder} />
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default AudioRecorder;
