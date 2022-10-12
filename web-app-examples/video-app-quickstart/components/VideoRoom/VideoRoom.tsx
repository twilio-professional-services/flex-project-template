import React, { useState } from "react";
import { useRouter } from "next/router";
import { SyncClient } from "twilio-sync";
import * as Video from "twilio-video";
import { Flex } from "@twilio-paste/core/flex";
import {
  Stack,
  Button,
  Tooltip,
  Grid,
  Column,
  Card,
  MediaBody,
  MediaFigure,
  MediaObject,
} from "@twilio-paste/core";
import { Text } from "@twilio-paste/text";
import {
  BsCameraVideoFill,
  BsCameraVideoOff,
  BsMicFill,
  BsMicMuteFill,
} from "react-icons/bs";
import { TbScreenShareOff, TbScreenShare } from "react-icons/tb";
import { CgClose } from "react-icons/cg";

import {
  CenterContent,
  OverlayContent,
  VideoDivContainer,
  FooterDiv,
  MaxWidthDiv,
  ParticipantContainer,
} from "../../utils/styles";
import {
  attachLocalTracks,
  attachRemoteTracks,
  detachTracks,
} from "../../utils/helper";
import PostVideoRoom from "../PostVideoRoom/PostVideoRoom";

const BACKEND_URL = process.env.SERVERLESS_FUNCTIONS_DOMAIN;

export default function VideoRoom() {
  const router = useRouter();
  const { code } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postCall, setPostCall] = useState<boolean>(false);
  const [localAudio, setLocalAudio] = useState<Video.LocalAudioTrack | null>(
    null
  );
  const [localVideo, setLocalVideo] = useState<Video.LocalVideoTrack | null>(
    null
  );
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [screenTrack, setScreenTrack] = useState<any>(null);
  const [activeRoom, setActiveRoom] = useState<Video.Room | null>(null);
  const [buttonText, setButtonText] = useState("Join Video Room");
  const [agentConnected, setAgentConnected] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | undefined>("");

  async function process_sync_data_update(data: any) {
    if (!activeRoom && data.room) {
      await connect_video();
    } else {
      setJoinError(true);
    }
  }

  async function connect_sync(code: any) {
    // Obtain a JWT access token
    setSyncError("");
    await fetch(
      `${BACKEND_URL}/features/chat-to-video-escalation/client-get-sync-token?code=${code}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw response.error;
        }
        return new SyncClient(response.token);
      })
      .then((client) => client.document(code))
      .then((document) => {
        console.log("Code Validated. Sync document SID:", document.sid);
        process_sync_data_update(document.data);
        document.on("updated", (event) => {
          console.log('Received an "updated" Sync Document event: ', event);
          setAgentConnected(true);
          setButtonText("Join Video Room");
          process_sync_data_update(event.data);
        });
      })
      .catch((error) => {
        console.error("Unexpected error", error);
        setSyncError(error);
        setIsLoading(false);
      });
  }

  async function connect_video() {
    // Obtain a JWT access token

    await fetch(
      `${BACKEND_URL}/features/chat-to-video-escalation/client-get-video-token?code=${code}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw response.error;
        }
        console.log(response);
        return Video.connect(response.token);
      })
      .then(
        (room) => {
          setIsLoading(false);
          setButtonText("Connected!");
          setActiveRoom(room);

          Array.from(room.localParticipant.tracks.values()).forEach(
            (track: any) => {
              if (track.kind === "audio") {
                setLocalAudio(track.track);
                setAudioEnabled(track.track.isEnabled);
              } else {
                setLocalVideo(track.track);
                setVideoEnabled(track.track.isEnabled);
              }
            }
          );

          setupEventListeners(room);
          return room;
        },
        (error) => {
          console.error(`Unable to connect to Room: ${error.message}`);
          alert(`Unable to connect to Room: ${error.message}`);
        }
      )
      .catch((error) => {
        console.error("Unexpected error", error);
        alert(`Unexpected error: ${error}`);
      });
  }

  function setupEventListeners(room: Video.Room) {
    console.log(`Successfully joined a Room: ${room}`);
    const localParticipant = room.localParticipant;
    console.log(
      `Connected to the Room as LocalParticipant "${localParticipant.identity}"`
    );

    room.localParticipant.on("trackEnabled", (track) => {
      console.log("enabled", track);
    });

    room.localParticipant.on("trackDisabled", (track) => {
      console.log("disabled", track);
    });

    const remoteMedia = "remote-media-div";
    const localMedia = "local-media-div";

    // add local media
    const tracks = Array.from(localParticipant.tracks.values());
    attachLocalTracks(tracks, localMedia);

    // add existing participant tracks
    room.participants.forEach((participant) => {
      console.log(
        `IncomingVideoComponent: ${participant.identity} is already in the room}`
      );
      const tracks = Array.from(participant.tracks.values());
      attachRemoteTracks(tracks, remoteMedia);
    });

    // When a Participant joins the Room
    room.on("participantConnected", (participant) => {
      console.log(
        `IncomingVideoComponent: ${participant.identity} joined the room}`
      );
    });

    // when a participant adds a track, attach it
    room.on("trackSubscribed", (track, participant) => {
      console.log(
        `IncomingVideoComponent: ${participant} added track: ${track.kind}`
      );
      attachRemoteTracks([track], remoteMedia);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on("trackUnsubscribed", (track, participant) => {
      console.log(
        `IncomingVideoComponent: ${participant} removed track: ${track.kind}`
      );
      detachTracks([track]);
    });

    // When a Participant leaves the Room
    room.on("participantDisconnected", (participant) => {
      console.log(
        `IncomingVideoComponent: ${participant.identity} left the room`
      );
    });

    // Room disconnected
    room.on("disconnected", () => {
      console.log("IncomingVideoComponent: disconnected");
    });
  }

  async function joinVideoClicked() {
    setIsLoading(true);
    // Fetch sync token
    await connect_sync(code);
  }

  function mute() {
    console.log("mute clicked");
    if (localAudio) {
      localAudio.disable();
      setAudioEnabled(false);
    }
  }

  function unMute() {
    console.log("unmute clicked");

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

  function screenCapture() {
    if (!screenTrack) {
      navigator.mediaDevices
        .getDisplayMedia()
        .then((stream) => {
          let newScreenTrack = new Video.LocalVideoTrack(stream.getTracks()[0]);
          activeRoom?.localParticipant.publishTrack(newScreenTrack);
          setScreenTrack(newScreenTrack);
        })
        .catch(() => {
          alert("Could not share the screen.");
        });
    } else {
      activeRoom?.localParticipant.unpublishTrack(screenTrack);
      screenTrack.stop();
      setScreenTrack(null);
    }
  }

  function disconnect() {
    if (activeRoom) {
      activeRoom.disconnect();
      setActiveRoom(null);
      setPostCall(true);
    }
  }

  return (
    <>
      {!activeRoom ? (
        <>
          {!postCall ? (
            <CenterContent>
              <Flex
                hAlignContent={"center"}
                vertical
                vAlignContent={"center"}
                height="100%"
              >
                <MediaObject
                  as="div"
                  verticalAlign="center"
                  marginBottom={"space40"}
                >
                  <MediaFigure as="div" spacing="space40">
                    <img
                      src="https://hosted-assets-2838-dev.twil.io/twilio.png"
                      height="40px"
                    />
                  </MediaFigure>
                  <MediaBody as="div">
                    <Text
                      as="p"
                      fontSize="fontSize70"
                      fontWeight="fontWeightMedium"
                    >
                      Video Room - {code}
                    </Text>
                  </MediaBody>
                </MediaObject>
                <MaxWidthDiv>
                  <Card padding="space100">
                    <Flex vertical hAlignContent={"center"}>
                      {joinError && (
                        <Flex marginBottom={"space60"}>
                          <Text
                            as="p"
                            fontSize="fontSize60"
                            fontWeight="fontWeightMedium"
                            color="colorText"
                          >
                            {agentConnected
                              ? "Agent connected."
                              : "Waiting for agent to join..."}
                          </Text>
                        </Flex>
                      )}
                      {syncError && (
                        <Flex marginBottom={"space60"}>
                          <Text
                            as="p"
                            fontSize="fontSize60"
                            fontWeight="fontWeightMedium"
                            color="colorTextError"
                          >
                            Error: {syncError}
                          </Text>
                        </Flex>
                      )}
                      <Button
                        variant="destructive"
                        onClick={async () => await joinVideoClicked()}
                        loading={isLoading}
                        style={{ background: "#F22F46" }}
                      >
                        {buttonText}
                      </Button>
                      <span
                        style={{
                          color: "#000000",
                          lineHeight: 1,
                          fontSize: "12px",
                          letterSpacing: "wider",
                          marginTop: "15px",
                          textAlign: "center",
                        }}
                      >
                        Click to join the video room!
                      </span>
                    </Flex>
                  </Card>
                </MaxWidthDiv>
              </Flex>
            </CenterContent>
          ) : (
            <PostVideoRoom />
          )}
        </>
      ) : (
        <Flex vertical width={"100%"} hAlignContent="center">
          <MediaObject
            as="div"
            verticalAlign="center"
            marginBottom={"space60"}
            marginTop="space60"
          >
            <MediaFigure as="div" spacing="space40">
              <img
                src="https://hosted-assets-2838-dev.twil.io/twilio.png"
                height="40px"
              />
            </MediaFigure>
            <MediaBody as="div">
              <Text as="p" fontSize="fontSize70" fontWeight="fontWeightMedium">
                Video Room - {code}
              </Text>
            </MediaBody>
          </MediaObject>
          <Grid
            padding="space10"
            gutter={["space20", "space60", "space90"]}
            vertical={[true, true, false]}
          >
            <Column width="100%" height="auto">
              <ParticipantContainer>
                <VideoDivContainer id="remote-media-div"></VideoDivContainer>
                <OverlayContent>
                  <Text
                    as="p"
                    fontWeight="fontWeightMedium"
                    color="colorTextBrandHighlight"
                  >
                    Remote Participant
                  </Text>
                </OverlayContent>
              </ParticipantContainer>
            </Column>
            <Column width="100%">
              <ParticipantContainer>
                <VideoDivContainer id="local-media-div"></VideoDivContainer>
                <OverlayContent>
                  <Text
                    as="p"
                    fontWeight="fontWeightMedium"
                    color="colorTextBrandHighlight"
                  >
                    Local Participant (you)
                  </Text>
                </OverlayContent>
              </ParticipantContainer>
            </Column>
          </Grid>
          <FooterDiv>
            <Flex width="100%" hAlignContent={"center"} vAlignContent="center">
              <Stack orientation="horizontal" spacing="space50">
                <Flex>
                  {audioEnabled ? (
                    <div>
                      <Tooltip text="Mute" placement="bottom">
                        <Button
                          variant="secondary"
                          size="circle"
                          onClick={mute}
                        >
                          <BsMicFill
                            style={{ width: "25px", height: "25px" }}
                          />
                        </Button>
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <Tooltip text="Unmute" placement="bottom">
                        <Button
                          variant="primary"
                          size="circle"
                          onClick={unMute}
                        >
                          <BsMicMuteFill
                            style={{ width: "25px", height: "25px" }}
                          />
                        </Button>
                      </Tooltip>
                    </div>
                  )}
                </Flex>
                <Flex>
                  {videoEnabled ? (
                    <div>
                      <Tooltip text="Stop Camera" placement="bottom">
                        <Button
                          variant="secondary"
                          size="circle"
                          onClick={videoOff}
                        >
                          <BsCameraVideoFill
                            style={{ width: "25px", height: "25px" }}
                          />
                        </Button>
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <Tooltip text="Start Camera" placement="bottom">
                        <Button
                          variant="primary"
                          size="circle"
                          onClick={videoOn}
                        >
                          <BsCameraVideoOff
                            style={{ width: "25px", height: "25px" }}
                          />
                        </Button>
                      </Tooltip>
                    </div>
                  )}
                </Flex>
                <Flex>
                  <div>
                    <Tooltip
                      text={
                        screenTrack ? "Stop Sharing Screen" : "Share Screen"
                      }
                      placement="bottom"
                    >
                      <Button
                        variant={screenTrack ? "primary" : "secondary"}
                        size="circle"
                        onClick={screenCapture}
                      >
                        {screenTrack ? (
                          <TbScreenShareOff
                            style={{ width: "25px", height: "25px" }}
                          />
                        ) : (
                          <TbScreenShare
                            style={{ width: "25px", height: "25px" }}
                          />
                        )}
                      </Button>
                    </Tooltip>
                  </div>
                </Flex>
                <Flex>
                  <div>
                    <Tooltip text="Disconnect" placement="bottom">
                      <Button
                        variant="primary"
                        size="circle"
                        onClick={disconnect}
                      >
                        <CgClose style={{ width: "25px", height: "25px" }} />
                      </Button>
                    </Tooltip>
                  </div>
                </Flex>
              </Stack>
            </Flex>
          </FooterDiv>
        </Flex>
      )}
    </>
  );
}
