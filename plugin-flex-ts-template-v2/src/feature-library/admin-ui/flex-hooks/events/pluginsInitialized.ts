import { FlexEvent } from '../../../../types/feature-loader';
import { registerOpenFeatureSettingsAction } from '../custom-action/openFeatureSettings';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerAdminAction() {
  registerOpenFeatureSettingsAction();
};
