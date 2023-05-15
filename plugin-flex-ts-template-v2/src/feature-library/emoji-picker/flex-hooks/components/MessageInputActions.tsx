import * as Flex from '@twilio/flex-ui';

import EmojiPicker from '../../custom-components/EmojiPicker';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MessageInputActions;
export const componentHook = function addEmojiToMessageInputActions(flex: typeof Flex, _manager: Flex.Manager) {
  flex.MessageInputActions.Content.add(<EmojiPicker key="emoji-picker-component" />, {
    sortOrder: -1,
  });
};
