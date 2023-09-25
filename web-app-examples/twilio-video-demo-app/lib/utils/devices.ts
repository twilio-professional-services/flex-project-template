// This function will return 'true' when the specified permission has been denied by the user.
// If the API doesn't exist, or the query function returns an error, 'false' will be returned.
export async function getPermissionStatus(name: "camera" | "microphone") {
  const permissionName = name as PermissionName; // workaround for https://github.com/microsoft/TypeScript/issues/33923

  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({
        name: permissionName,
      });
      return result;
    } catch {
      return null;
    }
  } else {
    return null;
  }
}

export async function getDeviceInfo() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    audioInputDevices: devices.filter((device) => device.kind === "audioinput"),
    videoInputDevices: devices.filter((device) => device.kind === "videoinput"),
    audioOutputDevices: devices.filter(
      (device) => device.kind === "audiooutput"
    ),
    hasAudioInputDevices: devices.some(
      (device) => device.kind === "audioinput"
    ),
    hasVideoInputDevices: devices.some(
      (device) => device.kind === "videoinput"
    ),
    isMicPermissionGranted: devices
      .filter((device) => device.kind === "audioinput")
      .every((d: MediaDeviceInfo) => d.label),
    isCameraPermissionGranted: devices
      .filter((device) => device.kind === "videoinput")
      .every((d: MediaDeviceInfo) => d.label),
  };
}

export const findDeviceByID = (id: string, deviceList: MediaDeviceInfo[]) => {
  const foundDevice = deviceList.find(
    (device: MediaDeviceInfo) => device.deviceId === id
  );
  if (foundDevice !== undefined) {
    return foundDevice;
  }
  return null;
};

export const isMobile = (() => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.userAgent !== "string"
  ) {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();
