import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex as FlexComponent } from '@twilio-paste/core/flex';
import { Text } from '@twilio-paste/core/text';

import { getMatchingTaskConfiguration } from '../../config';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { ExtendedWrapupState } from '../../flex-hooks/states/extendedWrapupSlice';
import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  task: ITask;
  channelDefinition?: Flex.TaskChannelDefinition;
}

const WrapupCountdown = ({ task, channelDefinition }: OwnProps) => {
  const [, setClock] = useState(true);

  const taskHelper = new Flex.TaskHelper(task);

  const { extendedReservationSids } = useSelector(
    (state: AppState) => state[reduxNamespace].extendedWrapup as ExtendedWrapupState,
  );

  useEffect(() => {
    // set up interval to trigger re-render every second
    const interval = setInterval(() => {
      setClock((clock) => !clock);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getDefaultTemplate = () => (
    <Flex.Template
      code={Flex.TaskChannelHelper.getTemplateForStatus(
        task,
        channelDefinition?.templates?.TaskCanvasHeader?.secondLine,
        Flex.TaskCanvasHeader as any,
      )}
      task={task}
      helper={taskHelper}
    />
  );

  const getWrapupTemplate = () => {
    if (!task) {
      return getDefaultTemplate();
    }

    const taskConfig = getMatchingTaskConfiguration(task);
    if (!taskConfig || !taskConfig.auto_wrapup) {
      // No auto-wrap for this task; use the default behavior
      return getDefaultTemplate();
    }

    try {
      let autoWrapTime = (task.dateUpdated.getTime() as number) + taskConfig.wrapup_time;

      if (extendedReservationSids.includes(task.sid) && taskConfig.extended_wrapup_time > 0) {
        // Auto-wrap enabled and extended
        autoWrapTime += taskConfig.extended_wrapup_time;
      } else if (extendedReservationSids.includes(task.sid) && taskConfig.extended_wrapup_time < 1) {
        // Auto-wrap enabled and extended, but the extension is unlimited; use the default behavior
        return getDefaultTemplate();
      }

      const seconds = Math.ceil(Math.max(autoWrapTime - Date.now(), 0) / 1000);
      return (
        <Flex.Template
          source={Flex.templates[StringTemplates.WrapupSecondsRemaining]}
          seconds={seconds}
          singular={seconds === 1}
        />
      );
    } catch {
      return getDefaultTemplate();
    }
  };

  return (
    <FlexComponent grow vertical element="WRAPUP_HEADER_CONTAINER">
      <Text as="h4" element="WRAPUP_HEADER_TITLE">
        <Flex.Template
          code={Flex.TaskChannelHelper.getTemplateForStatus(
            task,
            channelDefinition?.templates?.TaskCanvasHeader?.title,
            Flex.TaskCanvasHeader as any,
          )}
          task={task}
          helper={taskHelper}
        />
      </Text>
      <Text as="p" element="WRAPUP_HEADER_COUNTDOWN">
        {getWrapupTemplate()}
      </Text>
    </FlexComponent>
  );
};

export default WrapupCountdown;
