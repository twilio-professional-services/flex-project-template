import * as Flex from '@twilio/flex-ui';
import { View } from '@twilio/flex-ui';

import KeyboardShortcuts from '../../custom-components/KeyboardShortcuts/KeyboardShortcuts';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function KeyboardShortcutsView(_manager: Flex.Manager) {
  Flex.ViewCollection.Content.add(
    <View name="keyboard-shortcuts" key="keyboard-shortcuts-view">
      <KeyboardShortcuts key="keyboard-shortcuts-view-content" />
    </View>,
  );
};
