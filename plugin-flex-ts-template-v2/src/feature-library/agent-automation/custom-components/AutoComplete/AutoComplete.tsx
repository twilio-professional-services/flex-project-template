import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import React from 'react';

import { TaskQualificationConfig } from '../../types/ServiceConfiguration';
import { getMatchingTaskConfiguration } from '../../config';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';

export type Props = {
  task: ITask;
};

// this component is intended to execute an autocomplete
// and as such should only added to the canvas when a task is in wrapping
// eg: if: (props) => props.task.status === 'wrapping',
// this removes dependency on the reservationWrapped event which may fail
// to get delivered to the client on a bad network.
// this method allows for the task status, which is not a single event but a
// sync with the state of the task so even if the browser is refreshed
// the task will auto wrap

export interface OwnProps {
  task: ITask;
}

const autoCompleteTask = async (task: ITask, taskConfig: TaskQualificationConfig) => {
  const { sid } = task;

  try {
    const scheduledTime = task.dateUpdated.getTime() + taskConfig.wrapup_time;
    const currentTime = new Date().getTime();
    const timeout = scheduledTime - currentTime > 0 ? scheduledTime - currentTime : 0;

    setTimeout(async () => {
      if (task && Flex.TaskHelper.isInWrapupMode(task)) {
        if (taskConfig.default_outcome) {
          await TaskRouterService.updateTaskAttributes(task.taskSid, {
            conversations: {
              outcome: taskConfig.default_outcome,
            },
          });
        }
        Flex.Actions.invokeAction('CompleteTask', { sid });
      }
    }, timeout);
  } catch (error) {
    console.error(`Error attempting to set wrap up timeout for reservation: ${sid}`, error);
  }
};

class AutoComplete extends React.PureComponent<OwnProps> {
  componentDidMount() {
    const { task } = this.props;
    const taskConfig = getMatchingTaskConfiguration(task);
    if (taskConfig && taskConfig.auto_wrapup) autoCompleteTask(task, taskConfig);
  }

  render() {
    return null;
  }
}

export default AutoComplete;
