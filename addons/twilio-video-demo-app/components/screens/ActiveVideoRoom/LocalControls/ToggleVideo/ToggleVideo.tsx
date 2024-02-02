import React, { useState } from "react";
import * as Video from "twilio-video";
import { Tooltip, Button, useToaster, Toaster } from "@twilio-paste/core";
import { BsCameraVideoFill, BsCameraVideoOff } from "react-icons/bs";

import useDevices from "../../../../../lib/hooks/useDevices";
import { useVideoStore, VideoAppState } from "../../../../../store/store";
import { SELECTED_VIDEO_INPUT_KEY } from "../../../../../lib/constants";

export default function ToggleVideo() {
  const toaster = useToaster();
  const [isPublishing, setIsPublishing] = useState(false);
  const {
    localTracks,
    room,
    clearTrack,
    setLocalTracks,
    devicePermissions,
    setDevicePermissions,
  } = useVideoStore((state: VideoAppState) => state);
  const { hasVideoInputDevices } = useDevices(devicePermissions);

  const toggleVideo = async () => {
    if (!isPublishing) {
      if (localTracks.video) {
        localTracks.video.stop();
        clearTrack("video");
        const localTrackPublication = room?.localParticipant?.unpublishTrack(
          localTracks.video
        );
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        room?.localParticipant?.emit("trackUnpublished", localTrackPublication);
      } else {
        setIsPublishing(true);
        // Refresh preferred device ID from local storage
        let localVideoDeviceId = localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

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
              setDevicePermissions("camera", true);
              setIsPublishing(false);
              room?.localParticipant?.publishTrack(localTracks[0]);
            })
            .catch((error) => {
              toaster.push({
                message: `Error: ${error.message}`,
                variant: "error",
              });
              setDevicePermissions("camera", false);
            });
        } else {
          toaster.push({
            message: `Error: No video device found`,
            variant: "error",
          });
          setDevicePermissions("camera", false);
        }
      }
    }
  };

  return (
    <>
      <Tooltip
        text={
          !hasVideoInputDevices
            ? "No video"
            : !!localTracks.video
            ? "Stop Camera"
            : "Start Camera"
        }
        placement="bottom"
      >
        <Button
          variant={!!localTracks.video ? "primary" : "destructive"}
          size="circle"
          onClick={toggleVideo}
        >
          {!!localTracks.video ? (
            <BsCameraVideoFill style={{ width: "25px", height: "25px" }} />
          ) : (
            <BsCameraVideoOff style={{ width: "25px", height: "25px" }} />
          )}
        </Button>
      </Tooltip>
      <Toaster {...toaster} />
    </>
  );
}
