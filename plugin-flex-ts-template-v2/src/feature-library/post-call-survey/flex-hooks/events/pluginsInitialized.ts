import { FlexEvent } from '../../../../types/feature-loader';
import { registerOpenPCSSettingsAction } from '../custom-action/openPCRSettings';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerAdminAction() {
  registerOpenPCSSettingsAction();
};
