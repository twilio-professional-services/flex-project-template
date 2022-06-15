import * as Flex from '@twilio/flex-ui';
import CallbackComponent from '../../custom-components/callback'
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.callbacks;

export function replaceViewForCallbacks(flex: typeof Flex, manager: Flex.Manager) {
  
  if(!enabled) return;

  Flex.TaskInfoPanel.Content.replace(<CallbackComponent key="callback-component" manager={manager} />, {
    sortOrder: -1,
    if: (props) => props.task.attributes.taskType === 'callback',
  });
}
