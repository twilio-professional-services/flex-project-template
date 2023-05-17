import React from 'react';
import { Grid, Card, Text, Paragraph } from '@twilio-paste/core';
import MicRecorder from 'mic-recorder-to-mp3';
import { IconButton , Actions} from '@twilio/flex-ui';
import FlexState from '../../helpers/flexHelper';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export interface OwnProps {
  showRecorder: boolean;
}

export type Props = OwnProps;

class AudioRecorderPanel extends React.Component<Props> {
  state = {
    isRecording: false,
    audioURL: '',
    blobURL: '',
    recorder: null,
    isBlocked: false,
    showRecorder: this.props.showRecorder,
  };

  startRec = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({ isRecording: true });
        })
        .catch((e: any) => console.error(e.message));
    }
  };

  stopRec = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]: [Uint8Array, Blob]) => {
        const blobURL = URL.createObjectURL(blob);
        const conversationSid = FlexState.flexState.chat.messageList.activeConversation;
        return this.sendRec(buffer, conversationSid).then(() => {
          this.setState({ blobURL, isRecording: false });
        });
      })
      .catch((e: any) => console.log(e.message));
  };

  sendRec = async (buffer: any, conversationSid: any) => {
    const audioFile = new File(buffer, 'voice-recording.mp3', {
      type: 'audio/mpeg',
      lastModified: Date.now(),
    });

    Actions.invokeAction('AttachFiles', {
      files: [audioFile],
      conversationSid,
    });
  };

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log('Permission granted');
          this.setState({ isBlocked: false });
        })
        .catch(() => {
          console.log('Permission denied');
          this.setState({ isBlocked: true });
        });
    }
  }

  render() {
    const { showRecorder } = this.props;
    const { blobURL } = this.state;
    if (showRecorder) {
      return (
        <div>
          <Grid gutter="space40" vertical>
            <Card padding="space40">
              <Text as="p" marginBottom="space30" color="colorTextWeak">
                Audio Recorder
              </Text>
              <Text as="p" marginBottom="space20"></Text>
              <Paragraph>
                <audio src={this.state.blobURL} controls={this.state.isRecording ? undefined : true} />
              </Paragraph>
              <Paragraph marginBottom="space0">
                <IconButton icon="MuteLarge" onClick={this.startRec} disabled={this.state.isRecording} />
                <IconButton icon="MuteLargeBold" onClick={this.stopRec} disabled={!this.state.isRecording} />
              </Paragraph>
            </Card>
          </Grid>
        </div>
      );
    }
    return <></>;
  }
}

export default AudioRecorderPanel;
