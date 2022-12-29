import * as Flex from '@twilio/flex-ui';
import CallbackAndVoicemail from '../../custom-components/CallbackAndVoicemail';
import { isFeatureEnabled, isAllowRequeueEnabled, getMaxAttempts } from '../..';

export function replaceViewForCallbackAndVoicemail(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!isFeatureEnabled()) return;

  Flex.TaskInfoPanel.Content.replace(<CallbackAndVoicemail key="callback-component"  allowRequeue={isAllowRequeueEnabled()} maxAttempts={getMaxAttempts()} />, {
    sortOrder: -1,
    if: (props) => ['callback', 'voicemail'].includes(props.task.attributes.taskType),
  });
}
