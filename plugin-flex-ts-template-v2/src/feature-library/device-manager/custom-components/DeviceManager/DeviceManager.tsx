import React, { useState, useEffect } from "react";
import { Manager } from "@twilio/flex-ui";
import {
  Flex,
  MenuButton,
  MenuGroup,
  useMenuState,
  Menu,
  MenuItem,
  useToaster,
  Toaster,
} from "@twilio-paste/core";
import { VolumeOnIcon } from "@twilio-paste/icons/esm/VolumeOnIcon";
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { SecondDevice } from "../../../multi-call/helpers/MultiCallHelper";
import { isFeatureEnabled as isMultiCallEnabled } from '../../../multi-call';

const DeviceManager: React.FunctionComponent = () => {
  const menu = useMenuState();
  const toaster = useToaster();
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);

  function refreshDevices() {
    navigator.mediaDevices.enumerateDevices().then((foundDevices) => {
      setDevices(foundDevices);
    });
  }

  const selectedDevice = (selectedDevice: MediaDeviceInfo) => {
    try {
      let { voiceClient } = Manager.getInstance();

      voiceClient?.audio?.speakerDevices.set(selectedDevice.deviceId);

      devices?.forEach((device: MediaDeviceInfo) => {
        if (
          device.groupId === selectedDevice.groupId &&
          device.kind === "audioinput"
        ) {
          voiceClient?.audio?.setInputDevice(device.deviceId);
        }
      });
      
      // set SecondDevice options if multi-call feature is enabled
      if (isMultiCallEnabled()) {
        SecondDevice?.audio?.speakerDevices.set(selectedDevice.deviceId);
        
        devices?.forEach((device: MediaDeviceInfo) => {
          if (
            device.groupId === selectedDevice.groupId &&
            device.kind === "audioinput"
          ) {
            SecondDevice?.audio?.setInputDevice(device.deviceId);
          }
        });
      }

      menu.hide();

      toaster.push({
        message: `Set ${selectedDevice.label} as your audio device.`,
        variant: "success",
        dismissAfter: 3000,
      });
    } catch (e) {
      toaster.push({
        message: `There was an error attempting to set ${selectedDevice.label} as your audio device.`,
        variant: "error",
      });
    }
  };

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);

    return function cleanup() {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        refreshDevices
      );
    };
  }, []);

  if (devices) {
    return (
      <Flex
        hAlignContent="center"
        vAlignContent={"center"}
      >
        <MenuButton {...menu} variant="reset" element={menu.visible ? "DEVICE_MGR_BUTTON_OPEN" : "DEVICE_MGR_BUTTON"}>
          <AgentIcon decorative />
        </MenuButton>
        <Menu {...menu} aria-label="Actions">
          <MenuGroup
            label="Select an Audio Device"
            icon={<VolumeOnIcon decorative />}
          >
            {devices.map((device) => {
              if (device.kind == "audiooutput") {
                return (
                  <MenuItem {...menu} onClick={() => selectedDevice(device)} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                );
              }
            })}
          </MenuGroup>
        </Menu>
        <Toaster {...toaster} />
      </Flex>
    );
  }

  return null;
};

export default DeviceManager;
