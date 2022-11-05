import * as Flex from '@twilio/flex-ui';
import CallbackAndVoicemail from '../../custom-components/CallbackAndVoicemail'
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false, allow_requeue, max_attempts } = custom_data?.features?.callbacks || {}

export function replaceViewForCallbackAndVoicemail(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;

  Flex.TaskInfoPanel.Content.replace(<CallbackAndVoicemail key="callback-component"  allowRequeue={allow_requeue} maxAttempts={max_attempts} />, {
    sortOrder: -1,
    if: (props: any) => ['callback', 'voicemail'].includes(props.task.attributes.taskType),
  });
}
