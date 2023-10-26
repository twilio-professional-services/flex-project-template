import React, { useEffect, useState } from "react";
import * as Video from "twilio-video";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
  ModalHeader,
  ModalHeading,
  Paragraph,
  Select,
  Option,
  Flex,
  Stack,
  Tooltip,
  useToaster,
  Toaster,
} from "@twilio-paste/core";
import { useUID } from "@twilio-paste/core/uid-library";
import { FiSettings } from "react-icons/fi";

import useDevices from "../../lib/hooks/useDevices";
import useMediaStreamTrack from "../../lib/hooks/useMediaStreamTrack";
import VideoPreview from "../screens/PreJoinScreen/VideoPreview/VideoPreview";
import { useVideoStore, VideoAppState } from "../../store/store";
import { findDeviceByID } from "../../lib/utils/devices";
import {
  TEXT_COPY,
  SELECTED_AUDIO_INPUT_KEY,
  SELECTED_AUDIO_OUTPUT_KEY,
  SELECTED_VIDEO_INPUT_KEY,
} from "../../lib/constants";

interface ConfigureSettingsProps {}

export default function ConfigureSettings({}: ConfigureSettingsProps) {
  const toaster = useToaster();
  const { CONFIGURE_SETTINGS_HEADER, CONFIGURE_SETTINGS_DESCRIPTION } =
    TEXT_COPY;
  const {
    localTracks,
    formData,
    devicePermissions,
    activeSinkId,
    setActiveSinkId,
    room,
  } = useVideoStore((state: VideoAppState) => state);
  const localVideo = localTracks.video;
  const localAudio = localTracks.audio;
  const [storedLocalVideoDeviceId, setStoredLocalVideoDeviceId] = useState(
    localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)
  );
  const [storedLocalAudioInputDeviceId, setStoredLocalAudioInputDeviceId] =
    useState(localStorage.getItem(SELECTED_AUDIO_INPUT_KEY));
  const [storedLocalAudioOutputDeviceId, setStoredLocalAudioOutputDeviceId] =
    useState(localStorage.getItem(SELECTED_AUDIO_OUTPUT_KEY));
  const { videoInputDevices, audioInputDevices, audioOutputDevices } =
    useDevices(devicePermissions);

  // Default preview tracks to local video and audio tracks (if they exist)
  const [previewVideo, setPreviewVideo] = useState(localVideo);
  const [previewAudio, setPreviewAudio] = useState(localAudio);

  // Need the MediaStreamTrack to be able to react to (and re-render) on track restarts
  const previewMediaStreamTrack = useMediaStreamTrack(previewVideo);

  // Get the device ID of the active track, or the preferred device ID from local storage, or the first input device
  const videoInputDeviceId =
    previewMediaStreamTrack?.getSettings().deviceId ||
    storedLocalVideoDeviceId ||
    videoInputDevices?.find((device) => device.kind === "videoinput")?.deviceId;
  const audioInputDeviceId =
    storedLocalAudioInputDeviceId ||
    audioInputDevices?.find((device) => device.kind === "audioinput")?.deviceId;
  const audioOutputDeviceId =
    storedLocalAudioOutputDeviceId ||
    activeSinkId ||
    audioOutputDevices?.find((device) => device.kind === "audioinput")
      ?.deviceId;

  const { identity } = formData;
  const modalHeadingID = useUID();

  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => {
    if (devicePermissions.camera && videoInputDeviceId) {
      // Use active track as the preview (if there is one), otherwise create the preview track
      if (localVideo) {
        setPreviewVideo(localVideo);
      } else {
        // Start preview. If preview track was stopped on previous close, restart it
        generatePreviewVideoTrack(videoInputDeviceId);
      }
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    // Stop the preview track if it's not the active track (i.e. turn off camera light!)
    if (!localVideo) {
      previewVideo?.stop();
    }
    setIsOpen(false);
  };

  function deviceChange(
    deviceID: string,
    type: "video" | "audioInput" | "audioOutput"
  ) {
    const deviceList =
      type === "video"
        ? videoInputDevices
        : type === "audioInput"
        ? audioInputDevices
        : audioOutputDevices;
    const device = findDeviceByID(deviceID, deviceList);
    console.log(`changed ${type} to `, device?.label);

    /* TODO: NEED TO ADD IN DEVICE CONFIGURATION SWITCHING FOR AUDIO INPUT & OUTPUT */
    if (type === "video" && previewVideo?.mediaStreamTrack.id !== deviceID) {
      setStoredLocalVideoDeviceId(deviceID);
      localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, deviceID);
      generatePreviewVideoTrack(deviceID);
    }
    if (type === "audioInput") {
      setStoredLocalAudioInputDeviceId(deviceID);
      localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, deviceID);
      generatePreviewAudioTrack(deviceID);
    }
    if (type === "audioOutput") {
      setStoredLocalAudioOutputDeviceId(deviceID);
      localStorage.setItem(SELECTED_AUDIO_OUTPUT_KEY, deviceID);
      setActiveSinkId(deviceID);
    }
  }

  function generatePreviewVideoTrack(deviceID: string) {
    if (previewVideo) {
      previewVideo.restart({
        deviceId: { exact: deviceID },
      });
    } else {
      Video.createLocalVideoTrack({
        deviceId: { exact: deviceID },
      })
        .then((newTrack) => {
          setPreviewVideo(newTrack);
        })
        .catch((error) => {
          toaster.push({
            message: `Error creating local track - ${error.message}`,
            variant: "error",
          });
        });
    }
  }

  function generatePreviewAudioTrack(deviceID: string) {
    if (previewAudio) {
      previewAudio.restart({
        deviceId: { exact: deviceID },
      });
    } else {
      Video.createLocalAudioTrack({
        deviceId: { exact: deviceID },
      })
        .then((newTrack) => {
          setPreviewAudio(newTrack);
        })
        .catch((error) => {
          toaster.push({
            message: `Error creating local track - ${error.message}`,
            variant: "error",
          });
        });
    }
  }

  useEffect(() => {
    console.log("useEffect > ConfigureSettings");
    console.log("devicePermissions", devicePermissions);
  }, [devicePermissions]);

  return (
    <Flex hAlignContent={"center"} width="100%">
      <Tooltip text="Configure settings" placement="top">
        <Button variant={!room ? "secondary" : "reset"} onClick={handleOpen}>
          <FiSettings
            style={{
              width: "25px",
              height: "25px",
              marginRight: !room ? "6px" : "0px",
            }}
          />
          {!room ? "Settings" : null}
        </Button>
      </Tooltip>
      <Modal
        ariaLabelledby={modalHeadingID}
        isOpen={isOpen}
        onDismiss={handleClose}
        size="default"
      >
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            {CONFIGURE_SETTINGS_HEADER}
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Paragraph>{CONFIGURE_SETTINGS_DESCRIPTION}</Paragraph>
          <Stack orientation={"vertical"} spacing="space60">
            {devicePermissions.camera && (
              <VideoPreview
                identity={identity ?? "Guest"}
                localVideo={previewVideo}
              />
            )}
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">
                Video{" "}
                {devicePermissions.camera && localVideo === undefined
                  ? "(disabled)"
                  : localVideo?.isStopped
                  ? "(stopped)"
                  : ""}
              </Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "video")}
                defaultValue={
                  devicePermissions.camera
                    ? videoInputDeviceId ?? ""
                    : "no-cam-permission"
                }
                disabled={
                  videoInputDevices.length < 2 || !devicePermissions.camera
                }
              >
                {devicePermissions.camera ? (
                  videoInputDevices.map((videoInput: MediaDeviceInfo) => (
                    <Option
                      key={videoInput.deviceId}
                      value={videoInput.deviceId}
                    >
                      {videoInput.label}
                    </Option>
                  ))
                ) : (
                  <Option key="no-cam-permission" value="no-cam-permission">
                    Camera permissions have not been granted in the browser
                  </Option>
                )}
              </Select>
            </Stack>
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">Audio Input</Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "audioInput")}
                defaultValue={
                  devicePermissions.microphone
                    ? audioInputDeviceId
                    : "no-mic-permission"
                }
                disabled={
                  audioInputDevices.length < 2 || !devicePermissions.microphone
                }
              >
                {devicePermissions.microphone ? (
                  audioInputDevices.map((audioInput: MediaDeviceInfo) => (
                    <Option
                      key={audioInput.deviceId}
                      value={audioInput.deviceId}
                    >
                      {audioInput.label}
                    </Option>
                  ))
                ) : (
                  <Option key="no-mic-permission" value="no-mic-permission">
                    Microphone permissions have not been granted in the browser
                  </Option>
                )}
              </Select>
            </Stack>
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">Audio Output</Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "audioOutput")}
                defaultValue={
                  devicePermissions.microphone
                    ? audioOutputDeviceId
                    : "no-mic-permission"
                }
              >
                {devicePermissions.microphone ? (
                  audioOutputDevices.map((audioOutput: MediaDeviceInfo) => (
                    <Option
                      key={audioOutput.deviceId}
                      value={audioOutput.deviceId}
                    >
                      {audioOutput.label}
                    </Option>
                  ))
                ) : (
                  <Option key="no-mic-permission" value="no-mic-permission">
                    Microphone permissions have not been granted in the browser
                  </Option>
                )}
              </Select>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="destructive" onClick={handleClose}>
              Back
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
      <Toaster {...toaster} />
    </Flex>
  );
}
