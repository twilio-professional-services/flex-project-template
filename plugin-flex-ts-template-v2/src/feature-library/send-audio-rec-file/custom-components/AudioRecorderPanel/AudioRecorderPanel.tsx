import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { Actions, IconButton, templates } from '@twilio/flex-ui';
import MicRecorder from 'mic-recorder-to-mp3';
import { Grid, Card, Text, Paragraph } from '@twilio-paste/core';
import { Spinner } from '@twilio-paste/core/spinner';

// import { RecordIcon } from '@twilio-paste/icons/esm/RecordIcon';

import { AudioRecorderWrapper, AudioRecorderPopover } from './AudioRecorderPanel.Styles';
import { StringTemplates } from '../../flex-hooks/strings';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export interface OwnProps {
  showRecorder: boolean;
  audioFile?: any;
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
    audioFile: null,
    confirmSendFile: false,
    recordingMessage: '',
    flashing: false,
  };

  startRec = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({ isRecording: true, recordingMessage: 'Recording in progress ' });
        })
        .catch((e: any) => console.error(e.message));
    }
  };

  stopRec = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]: [Uint8Array, Blob]) => {
        const blobURL = URL.createObjectURL(blob);
        const conversationSid = Flex.Manager.getInstance().store.getState().flex.chat.messageList.activeConversation;

        // Detach existing file before sending the new one
        await this.dontSendRec();

        return this.sendRec(buffer, conversationSid).then(() => {
          this.setState({ blobURL, isRecording: false });
        });
      })
      .catch((e: any) => console.log(e.message));
  };

  dontSendRec = async () => {
    try {
      const { audioFile } = this.state;

      if (audioFile) {
        const conv = Flex.Manager.getInstance().store.getState().flex.chat.messageList.activeConversation;

        await Actions.invokeAction('DetachFile', {
          file: audioFile,
          conversationSid: conv,
        });

        this.setState({ isRecording: false, audioFile: null });
      } else {
        console.log('No audio file to detach.');
      }
    } catch (error) {
      console.log('Error during file detachment:', error);
    }
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

    this.setState({ audioFile }, () => {
      const updatedAudioFile = this.state.audioFile;
      console.log('Updated audioFile:', updatedAudioFile);
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
    if (showRecorder) {
      return (
        <div>
          <AudioRecorderWrapper>
            <AudioRecorderPopover>
              <Grid gutter="space40" vertical>
                <Card padding="space40">
                  <Text as="p" marginBottom="space30" color="colorTextWeak">
                    {templates[StringTemplates.AudioRecorder]()}
                  </Text>
                  <Text as="p" marginBottom="space20"></Text>
                  <audio src={this.state.blobURL} controls={!this.state.isRecording} />
                  <Paragraph marginBottom="space0">
                    {this.state.isRecording ? (
                      <>
                        <audio src={this.state.audioURL} controls={this.state.isRecording} />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Text as="p" marginBottom="space20" style={{ marginRight: '10px' }}>
                            {templates[StringTemplates.RecordingMessage]()}
                          </Text>
                          <Spinner decorative={false} title="Loading" color="colorTextError" />
                        </div>
                        <IconButton icon="MuteLargeBold" onClick={this.stopRec} />
                      </>
                    ) : (
                      <React.Fragment>
                        <IconButton icon="MuteLarge" onClick={this.startRec} />
                        {this.state.audioFile ? (
                          <>
                            <IconButton icon="Close" onClick={this.dontSendRec} />
                          </>
                        ) : null}
                      </React.Fragment>
                    )}
                  </Paragraph>
                </Card>
              </Grid>
            </AudioRecorderPopover>
          </AudioRecorderWrapper>
        </div>
      );
    }
    return null;
  }
}

export default AudioRecorderPanel;
