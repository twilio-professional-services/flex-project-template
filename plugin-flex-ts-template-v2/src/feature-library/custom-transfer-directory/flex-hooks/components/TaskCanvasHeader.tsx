import * as Flex from '@twilio/flex-ui';
import { IconButton, Actions } from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';

const onShowDirectory = () => {
  Actions.invokeAction('ShowDirectory');
};

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addTransferButtonToTaskCanvasHeader(flex: typeof Flex, _manager: Flex.Manager) {
  flex.TaskCanvasHeader.Content.add(
    <IconButton
      icon="TransferLarge"
      key="worker-directory-open"
      onClick={onShowDirectory}
      variant="secondary"
      title="Transfer Chat"
    />,
  );
};
