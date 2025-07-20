Use a keyboard shortcuts hook to register your own keyboard shortcuts.

```ts
import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Return an object of KeyboardShortcuts
export const keyboardShortcutHook = (flex: typeof Flex, manager: Flex.Manager) => ({
  D: {
    action: () => {
      Flex.Actions.invokeAction('ToggleOutboundDialer');
    },
    name: StringTemplates.CustomShortcutToggleDialpad,
    throttle: 100,
  },
  Q: {
    action: () => {
      Flex.Actions.invokeAction('ToggleSidebar');
    },
    name: StringTemplates.CustomShortcutToggleSidebar,
    throttle: 100,
  },
});
```