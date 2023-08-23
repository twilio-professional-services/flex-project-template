import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  SelectAudioDevice = 'PSDeviceMgrSelectAudioDevice',
  SetDeviceSuccess = 'PSDeviceMgrSetDeviceSuccess',
  SetDeviceError = 'PSDeviceMgrSetDeviceError',
  SelectOutputDevice = 'PSDeviceMgrSelectOutputDevice',
  SelectInputDevice = 'PSDeviceMgrSelectInputDevice',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.SelectAudioDevice]: 'Select an audio device',
    [StringTemplates.SetDeviceSuccess]: 'Set {{selectedDevice}} as your audio device.',
    [StringTemplates.SetDeviceError]: 'There was an error attempting to set {{selectedDevice}} as your audio device.',
    [StringTemplates.SelectOutputDevice]: 'Select an output device',
    [StringTemplates.SelectInputDevice]: 'Select an input device',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
