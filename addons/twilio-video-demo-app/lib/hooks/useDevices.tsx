import { useState, useEffect } from "react";
import { getDeviceInfo } from "../utils/devices";

// This returns the type of the value that is returned by a promise resolution
type ThenArg<T> = T extends PromiseLike<infer U> ? U : never;

interface InitialPermissions {
  camera: boolean;
  microphone: boolean;
}

export default function useDevices({ camera, microphone }: InitialPermissions) {
  const [deviceInfo, setDeviceInfo] = useState<
    ThenArg<ReturnType<typeof getDeviceInfo>>
  >({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
    hasAudioInputDevices: false,
    hasVideoInputDevices: false,
    isMicPermissionGranted: false,
    isCameraPermissionGranted: false,
  });

  useEffect(() => {
    const getDevices = () =>
      getDeviceInfo().then((devices: any) => setDeviceInfo(devices));
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, [camera, microphone]);

  return deviceInfo;
}
