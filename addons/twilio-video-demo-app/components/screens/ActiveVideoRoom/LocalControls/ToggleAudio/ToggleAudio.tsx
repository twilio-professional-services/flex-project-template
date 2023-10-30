import React from "react";
import * as Video from "twilio-video";
import { Tooltip, Button, useToaster, Toaster } from "@twilio-paste/core";
import { BsMicFill, BsMicMute } from "react-icons/bs";

import { useVideoStore, VideoAppState } from "../../../../../store/store";
import useIsTrackEnabled from "../../../../../lib/hooks/useIsTrackEnabled";
import { SELECTED_AUDIO_INPUT_KEY } from "../../../../../lib/constants";

export default function ToggleAudio() {
  const toaster = useToaster();
  const { localTracks, setLocalTracks, room, setDevicePermissions } =
    useVideoStore((state: VideoAppState) => state);
  const audioTrack = localTracks.audio;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudio = async () => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    } else {
      // Refresh preferred device ID from local storage
      let localAudioDeviceId = localStorage.getItem(SELECTED_AUDIO_INPUT_KEY);

      // If we have don't have a device id yet (e.g. from local storage), find one!
      if (!localAudioDeviceId) {
        const newDeviceID = await navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const newDeviceId = devices.find(
              (device) => device.kind === "audioinput"
            )?.deviceId;
            return newDeviceId ?? null;
          });
        localAudioDeviceId = newDeviceID;
      }

      if (localAudioDeviceId) {
        Video.createLocalTracks({
          audio: { deviceId: localAudioDeviceId },
          video: false,
        })
          .then((localTracks) => {
            setLocalTracks("audio", localTracks[0]);
            setDevicePermissions("microphone", true);
            room?.localParticipant?.publishTrack(localTracks[0]);
          })
          .catch((error) => {
            toaster.push({
              message: `Error: ${error.message}`,
              variant: "error",
            });
            setDevicePermissions("microphone", false);
          });
      } else {
        toaster.push({
          message: `Error: No audio input device found`,
          variant: "error",
        });
        setDevicePermissions("microphone", false);
      }
    }
  };

  return (
    <>
      <Tooltip
        text={!audioTrack ? "No audio" : isEnabled ? "Mute mic" : "Unmute mic"}
        placement="bottom"
      >
        <Button
          variant={isEnabled ? "primary" : "destructive"}
          size="circle"
          onClick={toggleAudio}
        >
          {isEnabled ? (
            <BsMicFill style={{ width: "25px", height: "25px" }} />
          ) : (
            <BsMicMute style={{ width: "25px", height: "25px" }} />
          )}
        </Button>
      </Tooltip>
      <Toaster {...toaster} />
    </>
  );
}
