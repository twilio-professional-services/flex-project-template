import * as Flex from '@twilio/flex-ui';
import CallbackComponent from '../../custom-components/callback'
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled, allow_requeue, max_attempts } = custom_data.features.callbacks;

export function replaceViewForCallbacks(flex: typeof Flex, manager: Flex.Manager) {
  
  if(!enabled) return;

  Flex.TaskInfoPanel.Content.replace(<CallbackComponent key="callback-component" allowRequeue={allow_requeue} maxAttempts={max_attempts} />, {
    sortOrder: -1,
    if: (props) => ['callback', 'voicemail'].includes(props.task.attributes.taskType),
  });
}
