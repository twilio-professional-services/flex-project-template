import React, { useState } from 'react';
import { ITask, Manager, Template, templates } from '@twilio/flex-ui';
import Video from 'twilio-video';
import { Flex, Button, Box, Heading, Tooltip } from '@twilio-paste/core';
import { VideoOnIcon } from '@twilio-paste/icons/esm/VideoOnIcon';
import { VideoOffIcon } from '@twilio-paste/icons/esm/VideoOffIcon';
import { MicrophoneOnIcon } from '@twilio-paste/icons/esm/MicrophoneOnIcon';
import { MicrophoneOffIcon } from '@twilio-paste/icons/esm/MicrophoneOffIcon';
import { CloseIcon } from '@twilio-paste/icons/esm/CloseIcon';

import { updateTaskAttributesForVideo } from '../../helpers/taskAttributes';
import { getFeatureFlags } from '../../../../utils/configuration';
import { btn, btnContainer, btnRow, mediaTrackContainer, taskContainerStyle } from './styles';
import { attachLocalTracks, attachRemoteTracks, detachTracks } from '../../helpers/videoRoom';
import { StringTemplates } from '../../flex-hooks/strings/ChatToVideo';

interface VideoRoomProps {
  task: ITask;
}

const {
  serverless_functions_domain = '',
  serverless_functions_protocol = 'https',
  serverless_functions_port,
} = getFeatureFlags() || {};

const domain = serverless_functions_port
  ? `${serverless_functions_domain}:${serverless_functions_port}`
  : serverless_functions_domain;

const BACKEND_URL = `${serverless_functions_protocol}://${domain}/features/chat-to-video-escalation`;

const VideoRoom: React.FunctionComponent<VideoRoomProps> = ({ task }) => {
  const [connecting, setConnecting] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Video.Room | null>(null);
  const [localAudio, setLocalAudio] = useState<Video.LocalAudioTrack | null>(null);
  const [localVideo, setLocalVideo] = useState<Video.LocalVideoTrack | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  function roomJoined(room: any) {
    console.log('IncomingVideoComponent: room joined: ', room);
    setActiveRoom(room);
    updateTaskAttributesForVideo(task, 'connected');

    // Save the local audio/video tracks in state so we can easily mute later
    Array.from(room.localParticipant.tracks.values()).forEach((track: any) => {
      if (track.kind === 'audio') {
        setLocalAudio(track.track);
      } else {
        setLocalVideo(track.track);
      }
    });

    // add local tracks to the screen
    attachLocalTracks(Array.from(room.localParticipant.tracks.values()), 'local-media');

    room.localParticipant.on('trackEnabled', (track: any) => {
      console.log('enabled', track);
      if (track === localAudio) {
        setAudioEnabled(true);
      } else if (track === localVideo) {
        setVideoEnabled(true);
      }
    });

    room.localParticipant.on('trackDisabled', (track: any) => {
      console.log('disabled', track);
      if (track === localAudio) {
        setAudioEnabled(false);
      } else if (track === localVideo) {
        setVideoEnabled(false);
      }
    });

    // add existing participant tracks
    room.participants.forEach((participant: any) => {
      console.log(participant);
      console.log(`IncomingVideoComponent: ${participant.identity} is already in the room}`);
      const tracks = Array.from(participant.tracks.values());
      attachRemoteTracks(tracks, 'remote-media');
    });

    // When a Participant joins the Room
    room.on('participantConnected', (participant: any) => {
      console.log(`IncomingVideoComponent: ${participant.identity} joined the room}`);
    });

    // when a participant adds a track, attach it
    room.on('trackSubscribed', (track: any, _publication: any, participant: any) => {
      console.log(`IncomingVideoComponent: ${participant.identity} added track: ${track.kind}`);
      attachRemoteTracks([track], 'remote-media');
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackUnsubscribed', (track: any, _publication: any, participant: any) => {
      console.log(`IncomingVideoComponent: ${participant.identity} removed track: ${track.kind}`);
      detachTracks([track]);
    });

    // When a Participant leaves the Room
    room.on('participantDisconnected', (participant: any) => {
      console.log(`IncomingVideoComponent: ${participant.identity} left the room`);
    });

    // Room disconnected
    room.on('disconnected', () => {
      console.log('IncomingVideoComponent: disconnected');
    });
  }

  function connectVideo() {
    if (task && task.attributes && task.attributes.syncDocument) {
      setConnecting(true);
      const body = {
        DocumentSid: task.attributes.syncDocument,
        Token: Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token,
      };
      const options = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      };
      fetch(`${BACKEND_URL}/agent-get-token`, options)
        .then(async (res) => res.json())
        .then(async (res) => {
          console.log('IncomingVideoComponent: got token: ', res.token);
          return Video.connect(res.token);
        })
        .then(roomJoined)
        .catch((err) => {
          updateTaskAttributesForVideo(task, 'error');
          alert(`Error joining video: ${err.message}`);
        })
        .finally(() => {
          setConnecting(false);
        });
    } else {
      alert(`Error joining video: the incoming task is invalid. Please send a new link to your client.`);
    }
  }

  function mute() {
    console.log('mute clicked');
    if (localAudio) {
      localAudio.disable();
      setAudioEnabled(false);
    }
  }

  function unMute() {
    console.log('unmute clicked');

    localAudio?.enable();
    setAudioEnabled(true);
  }

  function videoOn() {
    if (localVideo) {
      localVideo.enable();
      setVideoEnabled(true);
    }
  }

  function videoOff() {
    if (localVideo) {
      localVideo?.disable();
      setVideoEnabled(false);
    }
  }

  function disconnect() {
    if (activeRoom) {
      activeRoom.disconnect();
      setActiveRoom(null);
      updateTaskAttributesForVideo(task, 'disconnected');
    }
  }

  if (!task) return null;

  return (
    <>
      {activeRoom ? (
        <Flex vertical width={'100%'}>
          <Box width="100%" position={'absolute'} left={0}>
            <Flex vertical hAlignContent="center" width={'100%'}>
              <div id="remote-media" style={mediaTrackContainer}>
                <Flex padding={'space20'} width={'100%'} hAlignContent="center" marginTop="space10">
                  <Heading as="h3" variant="heading30" marginBottom="space0">
                    <Template source={templates[StringTemplates.RemoteParticipant]} />
                  </Heading>
                </Flex>
              </div>

              <div style={btnRow}>
                {audioEnabled ? (
                  <div style={btnContainer}>
                    <Tooltip text={templates.MuteCallTooltip()} placement="top">
                      <Button variant="primary" size="icon" style={btn} onClick={mute}>
                        <MicrophoneOnIcon decorative={false} title={templates.MuteCallTooltip()} />
                      </Button>
                    </Tooltip>
                  </div>
                ) : (
                  <div style={btnContainer}>
                    <Tooltip text={templates.UnmuteAriaLabel()} placement="top">
                      <Button variant="primary" size="icon" style={btn} onClick={unMute}>
                        <MicrophoneOffIcon decorative={false} title={templates.UnmuteAriaLabel()} />
                      </Button>
                    </Tooltip>
                  </div>
                )}
                {videoEnabled ? (
                  <div style={btnContainer}>
                    <Tooltip text={templates[StringTemplates.StopCamera]()} placement="top">
                      <Button variant="primary" size="icon" style={btn} onClick={videoOff}>
                        <VideoOnIcon decorative={false} title={templates[StringTemplates.StopCamera]()} />
                      </Button>
                    </Tooltip>
                  </div>
                ) : (
                  <div style={btnContainer}>
                    <Tooltip text={templates[StringTemplates.StartCamera]()} placement="top">
                      <Button variant="primary" size="icon" style={btn} onClick={videoOn}>
                        <VideoOffIcon decorative={false} title={templates[StringTemplates.StartCamera]()} />
                      </Button>
                    </Tooltip>
                  </div>
                )}
                <div style={btnContainer}>
                  <Tooltip text={templates[StringTemplates.Disconnect]()} placement="top">
                    <Button variant="destructive" size="icon" style={btn} onClick={disconnect}>
                      <CloseIcon decorative={false} title={templates[StringTemplates.Disconnect]()} />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <Flex hAlignContent={'center'} width={'100%'}>
                <div id="local-media">
                  <Flex padding={'space20'} width={'100%'} hAlignContent="center">
                    <Heading as="h6" variant="heading40" marginBottom="space0">
                      <Template source={templates[StringTemplates.LocalParticipant]} />
                    </Heading>
                  </Flex>
                </div>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <div style={taskContainerStyle}>
          {connecting ? (
            <Flex padding="space50">
              <Template source={templates[StringTemplates.Connecting]} />
            </Flex>
          ) : (
            <Flex padding="space50">
              <Button variant="primary" onClick={connectVideo}>
                <VideoOnIcon decorative />
                <Template source={templates[StringTemplates.JoinVideoRoom]} />
              </Button>
            </Flex>
          )}
        </div>
      )}
    </>
  );
};

export default VideoRoom;
