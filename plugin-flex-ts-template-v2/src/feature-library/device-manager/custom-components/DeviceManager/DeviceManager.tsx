import React, { useState, useEffect } from 'react';
import { Manager, templates } from '@twilio/flex-ui';
import { Device } from '@twilio/voice-sdk';
import { Flex, MenuButton, MenuGroup, useMenuState, Menu, MenuItem, useToaster, Toaster } from '@twilio-paste/core';
import { MicrophoneOnIcon } from '@twilio-paste/icons/esm/MicrophoneOnIcon';
import { VolumeOnIcon } from '@twilio-paste/icons/esm/VolumeOnIcon';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';

import { isInputSelectEnabled } from '../../config';
import { SecondDevice } from '../../../multi-call/helpers/MultiCallHelper';
import { isFeatureEnabled as isMultiCallEnabled } from '../../../multi-call/config';
import { StringTemplates } from '../../flex-hooks/strings';

const DeviceManager: React.FunctionComponent = () => {
  const menu = useMenuState();
  const toaster = useToaster();
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);

  function refreshDevices() {
    navigator.mediaDevices.enumerateDevices().then((foundDevices) => {
      setDevices(foundDevices);
    });
  }

  const setSelectedDevice = (selectedDevice: MediaDeviceInfo, voiceClient: Device) => {
    if (selectedDevice.kind === 'audiooutput') {
      voiceClient?.audio?.speakerDevices.set(selectedDevice.deviceId);
    } else {
      voiceClient?.audio?.setInputDevice(selectedDevice.deviceId);
    }

    // If user-selected inputs are disabled, automatically select the corresponding input device, if present.
    if (!isInputSelectEnabled()) {
      devices?.forEach((device: MediaDeviceInfo) => {
        if (device.groupId === selectedDevice.groupId && device.kind === 'audioinput') {
          voiceClient?.audio?.setInputDevice(device.deviceId);
        }
      });
    }
  };

  const selectedDevice = (selectedDevice: MediaDeviceInfo) => {
    try {
      const { voiceClient } = Manager.getInstance();

      setSelectedDevice(selectedDevice, voiceClient);

      // set SecondDevice options if multi-call feature is enabled
      if (isMultiCallEnabled() && SecondDevice) {
        setSelectedDevice(selectedDevice, SecondDevice);
      }

      menu.hide();

      toaster.push({
        message: templates[StringTemplates.SetDeviceSuccess]({ selectedDevice: selectedDevice.label }),
        variant: 'success',
        dismissAfter: 3000,
      });
    } catch (e) {
      toaster.push({
        message: templates[StringTemplates.SetDeviceError]({ selectedDevice: selectedDevice.label }),
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices.addEventListener('devicechange', refreshDevices);

    return function cleanup() {
      navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
    };
  }, []);

  if (devices) {
    return (
      <Flex hAlignContent="center" vAlignContent={'center'}>
        <MenuButton {...menu} variant="reset" element={menu.visible ? 'DEVICE_MGR_BUTTON_OPEN' : 'DEVICE_MGR_BUTTON'}>
          <AgentIcon decorative={false} title={templates[StringTemplates.SelectAudioDevice]()} />
        </MenuButton>
        <Menu {...menu} aria-label="Actions">
          <MenuGroup
            label={
              isInputSelectEnabled()
                ? templates[StringTemplates.SelectOutputDevice]()
                : templates[StringTemplates.SelectAudioDevice]()
            }
            icon={<VolumeOnIcon decorative />}
          >
            {devices
              .filter((device) => device.kind === 'audiooutput')
              .map((device) => (
                <MenuItem {...menu} onClick={() => selectedDevice(device)} key={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
          </MenuGroup>
          {isInputSelectEnabled() && (
            <MenuGroup label={templates[StringTemplates.SelectInputDevice]()} icon={<MicrophoneOnIcon decorative />}>
              {devices
                .filter((device) => device.kind === 'audioinput')
                .map((device) => (
                  <MenuItem {...menu} onClick={() => selectedDevice(device)} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
            </MenuGroup>
          )}
        </Menu>
        <Toaster {...toaster} />
      </Flex>
    );
  }

  return null;
};

export default DeviceManager;
