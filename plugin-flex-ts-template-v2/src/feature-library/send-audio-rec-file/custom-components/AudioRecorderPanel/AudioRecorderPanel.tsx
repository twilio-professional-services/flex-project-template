/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable no-negated-condition */
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
  lastAudioFile?: any;
  blobURL?: any;
  openHideRecorder: () => void;
  updateLatestAudioFile: (audioFile: any, blobURL: any) => void;
}

export type Props = OwnProps;

class AudioRecorderPanel extends React.Component<Props> {
  state = {
    isRecording: false,
    blobURL: this.props.blobURL,
    isBlocked: false,
    showRecorder: this.props.showRecorder,
    lastAudioFile: this.props.lastAudioFile,
    audioFile: this.props.lastAudioFile || null,
  };

  startRec = async () => {
    if (this.state.isBlocked) {
      console.log('send-audio-rec-file: Microphone access denied');
    } else if (this.state.audioFile !== null) {
      console.log('send-audio-rec-file: Audio file is already recorded.');
      try {
        const { audioFile } = this.state;

        if (audioFile) {
          await this.dontSendRec();

          // Only start recording if the file detachment is successful
          this.setState({ isRecording: false, audioFile: null });
          Mp3Recorder.start()
            .then(() => {
              this.setState({ isRecording: true });
            })
            .catch((e: any) => console.error(e.message));
        }
      } catch (error) {
        console.error('send-audio-rec-file: Error during file detachment:', error);
      }
    } else {
      // Start recording directly
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

        // Detach the existing file before sending the new one
        await this.dontSendRec();

        // Update the blobURL state with the audio URL
        this.setState({ blobURL, isRecording: false });

        return this.sendRec(buffer, conversationSid).then(() => {
          this.setState({ blobURL, isRecording: false });
        });
      })
      .catch((e: any) => console.error(e.message));
  };

  dontSendRec = async (lastAudioFile?: any) => {
    const conv = Flex.Manager.getInstance().store.getState().flex.chat.messageList.activeConversation;
    if (lastAudioFile) {
      await Actions.invokeAction('DetachFile', {
        file: lastAudioFile,
        conversationSid: conv,
      });

      this.setState({ isRecording: false, audioFile: null });
    } else {
      try {
        const { audioFile } = this.state;
        if (audioFile) {
          await Actions.invokeAction('DetachFile', {
            file: audioFile,
            conversationSid: conv,
          });

          this.setState({ isRecording: false, audioFile: null });
        }
      } catch (error) {
        console.error('send-audio-rec-file: Error during file detachment:', error);
      }
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

    this.setState({ audioFile });
  };

  handleAfterSendMessage = (payload: { attachedFiles: string | any[] }) => {
    if (payload.attachedFiles && payload.attachedFiles.length > 0) {
      const firstFile = payload.attachedFiles[0];
      if (firstFile.name === 'voice-recording.mp3') {
        this.setState({ showRecorder: false, audioFile: null, blobURL: '' });
        this.props.openHideRecorder();
      }
    }
  };

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log('send-audio-rec-file: Microphone access is granted');
          this.setState({ isBlocked: false });
          Actions.addListener('afterSendMessage', this.handleAfterSendMessage);

          // Checking if lastAudioFile is not null and update audioFile state
          if (this.props.lastAudioFile) {
            this.setState({ audioFile: this.props.lastAudioFile });
          }
        })
        .catch(() => {
          console.error('send-audio-rec-file: Microphone access denied');
          this.setState({ isBlocked: true });
        });
    }
  }

  componentWillUnmount() {
    Actions.removeListener('afterSendMessage', this.handleAfterSendMessage);
    const { audioFile, blobURL } = this.state;
    this.props.updateLatestAudioFile(audioFile, blobURL);
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
                  {this.state.audioFile ? <audio src={this.state.blobURL} controls={true} /> : null}
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
                            <>
                              <IconButton
                                icon="Close"
                                onClick={() => {
                                  this.dontSendRec(this.state.audioFile);
                                }}
                                title={templates[StringTemplates.RemoveRecButton]()}
                              />
                            </>
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
