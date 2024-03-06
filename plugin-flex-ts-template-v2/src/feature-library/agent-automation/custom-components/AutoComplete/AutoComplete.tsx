import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@twilio-paste/core/button';
import { CheckboxCheckIcon } from '@twilio-paste/icons/esm/CheckboxCheckIcon';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';

import { TaskQualificationConfig } from '../../types/ServiceConfiguration';
import { getMatchingTaskConfiguration } from '../../config';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { ExtendedWrapupState } from '../../flex-hooks/states/extendedWrapupSlice';
import { StringTemplates } from '../../flex-hooks/strings';

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

const AutoComplete = ({ task }: OwnProps) => {
  const [taskConfig, setTaskConfig] = useState<TaskQualificationConfig | null>(null);
  const [isExtended, setIsExtended] = useState(false);
  const [wrapTimer, setWrapTimer] = useState<number | null>(null);

  const { extendedReservationSids } = useSelector(
    (state: AppState) => state[reduxNamespace].extendedWrapup as ExtendedWrapupState,
  );

  const setAutoCompleteTimeout = async () => {
    const { sid } = task;

    if (!taskConfig) {
      return;
    }

    if (isExtended && taskConfig.extended_wrapup_time < 1) {
      return;
    }

    try {
      const scheduledTime =
        task.dateUpdated.getTime() + taskConfig.wrapup_time + (isExtended ? taskConfig.extended_wrapup_time : 0);
      const currentTime = new Date().getTime();
      const timeout = scheduledTime - currentTime > 0 ? scheduledTime - currentTime : 0;

      setWrapTimer(
        window.setTimeout(async () => {
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
        }, timeout),
      );
    } catch (error) {
      console.error(`Error attempting to set wrap up timeout for reservation: ${sid}`, error);
    }
  };

  useEffect(() => {
    setTaskConfig(getMatchingTaskConfiguration(task));
  }, []);

  useEffect(() => {
    if (taskConfig && taskConfig.auto_wrapup) setAutoCompleteTimeout();
  }, [taskConfig]);

  useEffect(() => {
    if (wrapTimer) {
      window.clearTimeout(wrapTimer);
    }
    if (
      taskConfig &&
      taskConfig.auto_wrapup &&
      taskConfig.allow_extended_wrapup &&
      (!isExtended || taskConfig.extended_wrapup_time > 0)
    ) {
      setAutoCompleteTimeout();
    }
  }, [isExtended]);

  useEffect(() => {
    if (
      extendedReservationSids &&
      extendedReservationSids.find((extendedReservationSid) => task && extendedReservationSid === task.sid)
    ) {
      setIsExtended(true);
    } else {
      setIsExtended(false);
    }
  }, [extendedReservationSids]);

  const extendWrapup = () => {
    Flex.Actions.invokeAction('ExtendWrapUp', { task, extend: !isExtended });
  };

  if (taskConfig?.allow_extended_wrapup) {
    return (
      <Button
        variant="secondary"
        size="small"
        element="EXTENDED_WRAPUP_BUTTON"
        pressed={isExtended}
        onClick={extendWrapup}
      >
        {isExtended ? <CheckboxCheckIcon decorative /> : <PlusIcon decorative />}
        <Flex.Template source={Flex.templates[StringTemplates.ExtendWrapup]} />
      </Button>
    );
  }

  return null;
};

export default AutoComplete;
