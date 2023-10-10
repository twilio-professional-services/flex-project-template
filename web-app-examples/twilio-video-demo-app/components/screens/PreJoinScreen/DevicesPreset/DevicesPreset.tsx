import React, { useEffect, useState } from "react";
import * as Video from "twilio-video";
import {
  Button,
  Flex,
  useToaster,
  Toaster,
  Card,
  Text,
  Stack,
  Switch,
} from "@twilio-paste/core";
import {
  BsCameraVideoFill,
  BsCameraVideoOff,
  BsMicFill,
  BsMicMuteFill,
} from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";

import { UIStep, useVideoStore, VideoAppState } from "../../../../store/store";
import { MaxWidthDiv } from "../../../styled";
import VideoPreview from "../VideoPreview/VideoPreview";
import ConfigureSettings from "../../../ConfigureSettings/ConfigureSettings";
import {
  SELECTED_VIDEO_INPUT_KEY,
  SELECTED_AUDIO_INPUT_KEY,
  TEXT_COPY,
} from "../../../../lib/constants";
import { useGetToken } from "../../../../lib/api";
import PermissionsWarning from "../PermissionsWarning/PermissionsWarning";
//import useMediaStreamTrack from "../../../../lib/hooks/useMediaStreamTrack";

interface DevicesPresetProps {}

export default function DevicesPreset({}: DevicesPresetProps) {
  const toaster = useToaster();
  const { HELP_TEXT_PRELIGHT_FAILED, HELP_TEXT_PRELIGHT_PASSED, HELP_TEXT_PRELIGHT_INFLIGHT } = TEXT_COPY;
  const { formData } = useVideoStore((state: VideoAppState) => state);
  const {
    localTracks,
    setLocalTracks,
    clearTrack,
    setActiveRoom,
    setUIStep,
    devicePermissions,
    setDevicePermissions,
  } = useVideoStore((state: VideoAppState) => state);
  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [preflightStatus, setPreflightStatus] = useState("idle");

  const { roomName, identity } = formData;
  const { data, isFetching, status: tokenStatus } = useGetToken(roomName, identity);
  const [loading, setLoading] = useState(false);

  const localVideo = localTracks.video;
  const localAudio = localTracks.audio;
  // Need the MediaStreamTrack to be able to react to (and re-render) on track restarts
  //const localMediaStreamTrack = useMediaStreamTrack(localVideo);

  const joinVideoClicked = async () => {
    setLoading(true);

    // Setup a local data track to be used per participant
    const dataTrack = new Video.LocalDataTrack({
      name: "emoji",
    });
    setLocalTracks("data", dataTrack);
    let tracks: (
      | Video.LocalVideoTrack
      | Video.LocalDataTrack
      | Video.LocalAudioTrack
    )[] = [dataTrack];

    if (localVideo) {
      tracks.push(localVideo);
    }

    if (localTracks.audio) {
      tracks.push(localTracks.audio);
    }

    if (data.token) {
      Video.connect(data.token, {
        tracks,
        dominantSpeaker: true,
        networkQuality: { local: 1, remote: 1 },
      })
        .then((room: Video.Room) => setActiveRoom(room))
        .then(() => setUIStep(UIStep.VIDEO_ROOM))
        .catch((error) => {
          toaster.push({
            message: `Error joining room - ${error.message}`,
            variant: "error",
          });
        });
    }

    setLoading(false);
  };

  function joinButtonText() {
    switch (preflightStatus) {
      case "idle":
        return "Join Room";
      case "loading":
        return "Loading...";
      case "passed":
        return "Join Video Room";
      case "failed":
        return "Unable to join";
    }
  }

  async function microphoneToggle() {
    if (micEnabled) {
      // stop the track
      localTracks.audio?.stop();
      clearTrack("audio");
      setMicEnabled(false);
    } else {
      // Refresh preferred device ID from local storage
      let localAudioInputDeviceId = localStorage.getItem(
        SELECTED_AUDIO_INPUT_KEY
      );

      if (!!localAudio) {
        // audio track setup -- restart the track
        localVideo?.restart();
        setMicEnabled(true);
      } else {
        // no existing track, ask for permissions and setup
        // If we have don't have a device id yet (e.g. from local storage), find one!
        if (!localAudioInputDeviceId) {
          const newDeviceID = await navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              const newDeviceId = devices.find(
                (device) => device.kind === "audioinput"
              )?.deviceId;
              return newDeviceId ?? null;
            });
          localAudioInputDeviceId = newDeviceID;
        }

        if (localAudioInputDeviceId) {
          Video.createLocalTracks({
            audio: { deviceId: localAudioInputDeviceId },
            video: false,
          })
            .then((localTracks) => {
              setLocalTracks("audio", localTracks[0]);
              setMicEnabled(true);
              setDevicePermissions("camera", true);
            })
            .catch((error) => {
              toaster.push({
                message: `Error: ${error.message}`,
                variant: "error",
              });
              setMicEnabled(false);
            });
        } else {
          toaster.push({
            message: `Error: No video device found`,
            variant: "error",
          });
          setMicEnabled(false);
        }
      }
    }
  }

  async function cameraToggle() {
    if (camEnabled) {
      // stop the track
      localVideo?.stop();
      clearTrack("video");
      setCamEnabled(false);
    } else {
      // Refresh preferred device ID from local storage
      let localVideoDeviceId = localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

      // either request permission and setup the local track
      // if already created but stopped, start the track
      if (!!localVideo) {
        // video track setup -- start the track
        localVideo?.restart();
        setCamEnabled(true);
      } else {
        // no existing track, ask for permissions and setup
        // If we have don't have a device id yet (e.g. from local storage), find one!
        if (!localVideoDeviceId) {
          const newDeviceID = await navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              const newDeviceId = devices.find(
                (device) => device.kind === "videoinput"
              )?.deviceId;
              return newDeviceId ?? null;
            });
          localVideoDeviceId = newDeviceID;
        }

        if (localVideoDeviceId) {
          Video.createLocalTracks({
            video: { deviceId: localVideoDeviceId },
            audio: false,
          })
            .then((localTracks) => {
              setLocalTracks("video", localTracks[0]);
              setCamEnabled(true);
              setDevicePermissions("camera", true);
            })
            .catch((error) => {
              toaster.push({
                message: `Error: ${error.message}`,
                variant: "error",
              });
              setCamEnabled(false);
            });
        } else {
          toaster.push({
            message: `Error: No video device found`,
            variant: "error",
          });
          setCamEnabled(false);
        }
      }
    }
  }

  // useEffect to run preflight test
  useEffect(() => {
    if (tokenStatus === "success") {
      setPreflightStatus("loading");
      const { token } = data;
      const preflightTest = Video.runPreflight(token, { duration: Number(process.env.NEXT_PUBLIC_PREFLIGHT_DURATION) || 10000 });

      preflightTest.on("progress", (progress: any) => {
        console.log("progress ", progress);
      });

      preflightTest.on("completed", (report: any) => {
        console.log("completed", report);
        setPreflightStatus("passed");
      });

      preflightTest.on("failed", (error: any) => {
        console.log("failed", error);
        toaster.push({
          message: "Preflight test failed 🙁",
          variant: "error",
        });
        setPreflightStatus("failed");
      });
    } else if (tokenStatus === "error") {
      toaster.push({
        message: "Unable to join the requested room.",
        variant: "error",
      });
    }
  }, [tokenStatus]);

  return (
    <MaxWidthDiv>
      <Card paddingTop="space60">
        <Stack orientation="vertical" spacing="space40">
          <VideoPreview
            identity={identity ?? "Guest"}
            localVideo={localVideo}
          />
          <Flex hAlignContent={"center"}>
            <Switch
              checked={micEnabled}
              onChange={() => {
                microphoneToggle();
              }}
            >
              {micEnabled ? (
                <BsMicFill
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "20px",
                    color: "rgb(72, 221, 0)",
                  }}
                />
              ) : (
                <BsMicMuteFill
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "20px",
                    color: "rgb(221, 39, 0)",
                  }}
                />
              )}
            </Switch>
            <Switch
              checked={camEnabled}
              onChange={() => {
                cameraToggle();
              }}
            >
              {camEnabled ? (
                <BsCameraVideoFill
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "rgb(72, 221, 0)",
                  }}
                />
              ) : (
                <BsCameraVideoOff
                  style={{
                    width: "20px",
                    height: "20px",

                    color: "rgb(221, 39, 0)",
                  }}
                />
              )}
            </Switch>
          </Flex>
          {(!devicePermissions.camera || !devicePermissions.microphone) && (
            <PermissionsWarning />
          )}
          <ConfigureSettings />
          <Flex hAlignContent={"center"} width="100%">
            <Stack orientation="vertical" spacing="space30">
              <Flex hAlignContent={"center"} width="100%" marginTop="space30">
                <Button
                  variant="destructive"
                  onClick={async () => await joinVideoClicked()}
                  loading={loading}
                  style={{ background: "#F22F46" }}
                  disabled={preflightStatus !== "passed" || tokenStatus !== "success" || isFetching}
                >
                  {joinButtonText()}
                </Button>
              </Flex>
              {preflightStatus !== "failed" && preflightStatus !== "passed" ? (
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
                  {HELP_TEXT_PRELIGHT_INFLIGHT}
                </span>
              ) : preflightStatus !== "failed" ? (
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
                  {HELP_TEXT_PRELIGHT_PASSED}
                </span>
              ) : (
                <Flex marginTop="space20">
                  <MdErrorOutline
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "rgb(221, 39, 0)",
                      marginRight: "10px",
                    }}
                  />
                  <Text as="p" fontSize="fontSize20">
                    {HELP_TEXT_PRELIGHT_FAILED}
                  </Text>
                </Flex>
              )}
            </Stack>
          </Flex>
        </Stack>
      </Card>
      <Toaster {...toaster} />
    </MaxWidthDiv>
  );
}
