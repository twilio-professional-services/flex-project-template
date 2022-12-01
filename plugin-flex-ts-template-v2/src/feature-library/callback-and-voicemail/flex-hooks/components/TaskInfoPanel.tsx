import * as Flex from '@twilio/flex-ui';
import CallbackAndVoicemail from '../../custom-components/CallbackAndVoicemail'
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false, allow_requeue, max_attempts } = getFeatureFlags().features?.callbacks || {};

export function replaceViewForCallbackAndVoicemail(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;

  Flex.TaskInfoPanel.Content.replace(<CallbackAndVoicemail key="callback-component"  allowRequeue={allow_requeue} maxAttempts={max_attempts} />, {
    sortOrder: -1,
    if: (props) => ['callback', 'voicemail'].includes(props.task.attributes.taskType),
  });
}
