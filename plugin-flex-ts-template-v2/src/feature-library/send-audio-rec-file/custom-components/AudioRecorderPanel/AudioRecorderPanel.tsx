import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { Actions, IconButton, templates } from '@twilio/flex-ui';
import MicRecorder from 'mic-recorder-to-mp3';
import { Grid, Card, Text } from '@twilio-paste/core';
import { Spinner } from '@twilio-paste/core/spinner';

import { AudioRecorderWrapper, AudioRecorderPopover } from './AudioRecorderPanel.Styles';
import { StringTemplates } from '../../flex-hooks/strings';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export interface OwnProps {
  showRecorder: boolean;
  audioFile?: any;
  openHideRecorder: () => void;
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
    flashing: false,
  };

  startRec = () => {
    if (this.state.isBlocked) {
      console.log('send-audio-rec-file: Access to Microphone Permission denied');
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
        console.log('send-audio-rec-file: No audio file to detach.');
      }
    } catch (error) {
      console.log('send-audio-rec-file: Error during file detachment:', error);
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
      console.log('send-audio-rec-file: audioFile:', updatedAudioFile);
    });
  };

  handleAfterSendMessage = (payload: { attachedFiles: string | any[] }) => {
    if (payload.attachedFiles && payload.attachedFiles.length > 0) {
      const firstFile = payload.attachedFiles[0];
      if (firstFile.name === 'voice-recording.mp3') {
        this.setState({ showRecorder: false });
        this.props.openHideRecorder();
      } else {
        console.log('send-audio-rec-file: not a voice recording file.');
      }
    } else {
    }
  };

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log('send-audio-rec-file: Microphone acess is granted');
          this.setState({ isBlocked: false });
          Actions.addListener('afterSendMessage', this.handleAfterSendMessage);
        })
        .catch(() => {
          console.log('send-audio-rec-file: Microphone acess denied');
          this.setState({ isBlocked: true });
        });
    }
  }

  componentWillUnmount() {
    Actions.removeListener('afterSendMessage', this.handleAfterSendMessage);
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
                  <audio src={this.state.blobURL} controls={this.state.audioFile ?? false} />
                  {this.state.isBlocked ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Text as="p" marginBottom="space30" color="colorTextWeak">
                        {templates[StringTemplates.MicBlockedMessage]()}
                      </Text>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {this.state.isRecording ? (
                        <>
                          <IconButton
                            icon="MuteLargeBold"
                            title={templates[StringTemplates.StopRecButton]()}
                            onClick={this.stopRec}
                          />
                          <Text as="p" marginLeft="space30" marginRight="space30">
                            {templates[StringTemplates.RecordingMessage]()}
                          </Text>
                          <Spinner decorative={true} color="colorTextError" />
                        </>
                      ) : (
                        <>
                          <IconButton
                            icon="MuteLarge"
                            title={templates[StringTemplates.StartRecButton]()}
                            onClick={this.startRec}
                          />
                          {this.state.audioFile ? (
                            <IconButton
                              icon="Close"
                              onClick={this.dontSendRec}
                              title={templates[StringTemplates.RemoveRecButton]()}
                            />
                          ) : null}
                        </>
                      )}
                    </div>
                  )}
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
