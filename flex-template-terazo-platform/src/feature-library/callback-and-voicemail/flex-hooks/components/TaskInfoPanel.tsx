import * as Flex from '@twilio/flex-ui';

import CallbackAndVoicemail from '../../custom-components/CallbackAndVoicemail';
import { isAllowRequeueEnabled, getMaxAttempts } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader/FlexComponent';

export const componentName = FlexComponent.TaskInfoPanel;
export const componentHook = function replaceViewForCallbackAndVoicemail(flex: typeof Flex, _manager: Flex.Manager) {
  flex.TaskInfoPanel.Content.replace(
    <CallbackAndVoicemail
      key="callback-component"
      allowRequeue={isAllowRequeueEnabled()}
      maxAttempts={getMaxAttempts()}
    />,
    {
      sortOrder: -1,
      if: (props) => ['callback', 'voicemail'].includes(props.task.attributes.taskType),
    },
  );
};
