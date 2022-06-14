import * as Flex from '@twilio/flex-ui';
import CallbackComponent from '../../custom-components/callback'

export function replaceViewForCallbacks(flex: typeof Flex, manager: Flex.Manager) {
  Flex.TaskInfoPanel.Content.replace(<CallbackComponent key="callback-component" manager={manager} />, {
    sortOrder: -1,
    if: (props) => props.task.attributes.taskType === 'callback',
  });
}
