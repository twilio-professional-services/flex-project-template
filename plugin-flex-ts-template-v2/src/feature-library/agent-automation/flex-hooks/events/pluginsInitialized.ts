import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { registerExtendWrapUpAction } from '../custom-actions/ExtendWrapUp';
import { getMatchingTaskConfiguration } from '../../config';
import { setAutoCompleteTimeout } from '../../utils/wrapupUtils';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = async function registerExtendWrapUpActionAndAutoWrapOnInit(
  flex: typeof Flex,
  manager: Flex.Manager,
) {
  registerExtendWrapUpAction();

  // Set wrapup timer for pre-existing wrapping tasks
  const { tasks } = manager.store.getState().flex.worker;
  tasks.forEach((task) => {
    if (!flex.TaskHelper.isInWrapupMode(task)) {
      return;
    }
    const config = getMatchingTaskConfiguration(task);
    if (!config || !config.auto_wrapup) {
      return;
    }

    setAutoCompleteTimeout(manager, task, config);
  });
};
