import { useEffect, useState } from 'react';
import { Actions, IconButton, Manager, templates } from '@twilio/flex-ui';
import SimpleAudioRecorder from 'simple-audio-recorder';
import { Grid } from '@twilio-paste/core/grid';
import { Card } from '@twilio-paste/core/card';
import { Text } from '@twilio-paste/core/text';
import { Spinner } from '@twilio-paste/core/spinner';

import { AudioRecorderWrapper, AudioRecorderPopover } from './AudioRecorderPanel.Styles';
import { StringTemplates } from '../../flex-hooks/strings';
import logger from '../../../../utils/logger';

export interface OwnProps {
  showRecorder: boolean;
  lastAudioFile?: any;
  playbackBlobUrl?: any;
  openHideRecorder: () => void;
  updateLatestAudioFile: (audioFile: any, blobURL: any) => void;
}

enum RecordingState {
  Idle,
  Loading,
  Recording,
  Error,
}

const AudioRecorderPanel = (props: OwnProps) => {
  const [playbackBlobUrl, setPlaybackBlobUrl] = useState(props.playbackBlobUrl);
  const [recorder, setRecorder] = useState(null as any);
  const [audioFile, setAudioFile] = useState(props.lastAudioFile);
  const [recState, setRecState] = useState(RecordingState.Idle);

  const attachmentName = 'voice-recording.mp3';

  useEffect(() => {
    Actions.addListener('afterSendMessage', handleAfterSendMessage);

    const recorder = new SimpleAudioRecorder({
      streaming: false,
      encoderBitRate: 128,
    });

    recorder.onstart = () => {
      setRecState(RecordingState.Recording);
    };

    recorder.onstop = async (mp3Blob: Blob) => {
      setRecState(RecordingState.Idle);
      setPlaybackBlobUrl(URL.createObjectURL(mp3Blob));
      attachRec(recorder.encodedData);
    };

    recorder.onerror = (error: any) => {
      logger.error('[send-audio-rec-file] Error:', error);
      setRecState(RecordingState.Error);
    };

    setRecorder(recorder);

    return () => {
      Actions.removeListener('afterSendMessage', handleAfterSendMessage);
    };
  }, []);

  useEffect(() => {
    props.updateLatestAudioFile(audioFile, playbackBlobUrl);
  }, [audioFile, playbackBlobUrl]);

  const startRec = async () => {
    try {
      setRecState(RecordingState.Loading);
      if (audioFile) {
        // Detach the existing file before starting the new one
        await detachRec();
      }
      recorder.start();
    } catch (error: any) {
      logger.error('[send-audio-rec-file] Error starting recording:', error);
    }
  };

  const stopRec = () => {
    setRecState(RecordingState.Loading);
    recorder.stop();
  };

  const attachRec = async (buffer: any[]) => {
    try {
      const file = new File(buffer, attachmentName, {
        type: 'audio/mpeg',
        lastModified: Date.now(),
      });

      Actions.invokeAction('AttachFiles', {
        files: [file],
        conversationSid: Manager.getInstance().store.getState().flex.chat.messageList.activeConversation,
      });

      setAudioFile(file);
    } catch (error: any) {
      logger.error('[send-audio-rec-file] Error while attaching file:', error);
    }
  };

  const detachRec = async () => {
    try {
      if (!audioFile) {
        logger.error('[send-audio-rec-file] No file to detach');
        return;
      }

      await Actions.invokeAction('DetachFile', {
        file: audioFile,
        conversationSid: Manager.getInstance().store.getState().flex.chat.messageList.activeConversation,
      });
    } catch (error: any) {
      logger.error('[send-audio-rec-file] Error during file detachment:', error);
    }

    setAudioFile(null);
    setPlaybackBlobUrl('');
  };

  const handleAfterSendMessage = (payload: { attachedFiles: string | any[] }) => {
    if (!payload.attachedFiles || !payload.attachedFiles.length) {
      // Nothing was attached
      return;
    }
    const firstFile = payload.attachedFiles[0];
    if (firstFile.name !== attachmentName) {
      // Not an attachment from this feature
      return;
    }
    setAudioFile(null);
    setPlaybackBlobUrl('');
    props.openHideRecorder();
  };

  if (!props.showRecorder) {
    return null;
  }

  return (
    <AudioRecorderWrapper>
      <AudioRecorderPopover>
        <Grid gutter="space40" vertical>
          <Card padding="space40">
            <Text as="p" marginBottom="space30" color="colorTextWeak">
              {templates[StringTemplates.AudioRecorder]()}
            </Text>
            {playbackBlobUrl && <audio src={playbackBlobUrl} controls={true} />}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {recState === RecordingState.Error && (
                <Text as="p" marginBottom="space30" color="colorTextWeak">
                  {templates[StringTemplates.MicBlockedMessage]()}
                </Text>
              )}
              {recState === RecordingState.Recording && (
                <>
                  <IconButton
                    icon="MuteLargeBold"
                    title={templates[StringTemplates.StopRecButton]()}
                    onClick={stopRec}
                  />
                  <Text as="p" marginLeft="space30" marginRight="space30">
                    {templates[StringTemplates.RecordingMessage]()}
                  </Text>
                  <Spinner decorative={true} color="colorTextError" />
                </>
              )}
              {(recState === RecordingState.Idle || recState === RecordingState.Loading) && (
                <>
                  <IconButton
                    icon="MuteLarge"
                    title={templates[StringTemplates.StartRecButton]()}
                    onClick={startRec}
                    disabled={recState === RecordingState.Loading}
                  />
                  {audioFile && (
                    <>
                      <IconButton
                        icon="Close"
                        onClick={() => {
                          detachRec();
                        }}
                        title={templates[StringTemplates.RemoveRecButton]()}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </Card>
        </Grid>
      </AudioRecorderPopover>
    </AudioRecorderWrapper>
  );
};

export default AudioRecorderPanel;
