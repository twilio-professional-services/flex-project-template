import * as Flex from "@twilio/flex-ui";
import { ITask } from "@twilio/flex-ui";
import { isFeatureEnabled, getMatchingTaskConfiguration } from "../.."
import { TaskQualificationConfig } from "feature-library/agent-automation/types/ServiceConfiguration";


function selectAndAcceptReservation(task: ITask, taskConfig: TaskQualificationConfig) {
  const {
    sid
  } = task

  // Attempt to accept the task
  if(taskConfig.auto_accept) Flex.Actions.invokeAction("AcceptTask", { sid });

  // Creating an interval to check the task has been accepted
  // and retries if it has not.  To avoid a runway process,
  // applying an attempts counter to ultimately abandon the retry
  // after ten attempts
  if(taskConfig.auto_select && taskConfig.auto_accept) {
    let attempts = 0;
    const selectTaskTimer = setInterval(() => {
      const task = Flex.TaskHelper.getTaskByTaskSid(
        sid
      );
      if (!task || !task.status) {
        clearInterval(selectTaskTimer);
        attempts = 0;
      } else if (Flex.TaskHelper.isTaskAccepted(task)) {
        Flex.Actions.invokeAction("SelectTask", { sid });
        clearInterval(selectTaskTimer);
        attempts = 0;
      } else if (attempts > 10) {
        clearInterval(selectTaskTimer);
        attempts = 0;
      } else {
        attempts++;
      }
    }, 500);
  } else if (taskConfig.auto_select) {
    Flex.Actions.invokeAction("SelectTask", { sid });
  }
}

export default function autoSelectAndAcceptReservation(task: ITask){
 
  if(!isFeatureEnabled()) return;

  const taskConfig = getMatchingTaskConfiguration(task);
  if(taskConfig) selectAndAcceptReservation(task, taskConfig);
}
