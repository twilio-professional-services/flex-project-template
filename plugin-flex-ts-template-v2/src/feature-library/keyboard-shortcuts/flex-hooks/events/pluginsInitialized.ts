import { FlexEvent } from '../../../../types/feature-loader';
import { initialize } from '../../utils/KeyboardShortcutsUtil';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function loadKeyboardShortcutSettings() {
  initialize();
};
