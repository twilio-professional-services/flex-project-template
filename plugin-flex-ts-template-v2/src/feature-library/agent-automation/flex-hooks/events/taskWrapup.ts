import * as Flex from "@twilio/flex-ui";
import { ITask } from "@twilio/flex-ui";
import { isFeatureEnabled, getMatchingTaskConfiguration } from "../.."
import { TaskQualificationConfig } from "feature-library/agent-automation/types/ServiceConfiguration";


function autoCompleteTask(task: ITask, taskConfig: TaskQualificationConfig) {
  const { sid } = task

  setTimeout(() => {
    const task = Flex.TaskHelper.getTaskByTaskSid(
      sid
    );

    if (task && Flex.TaskHelper.isInWrapupMode(task)) {
      Flex.Actions.invokeAction("CompleteTask", { sid });
    }
  }, taskConfig.wrapup_time);
}

export default function autoCompleteTaskAfterTimeout(task: ITask){
 
  if(!isFeatureEnabled()) return;

  const taskConfig = getMatchingTaskConfiguration(task);
  if(taskConfig && taskConfig.auto_wrapup) autoCompleteTask(task, taskConfig);
}
