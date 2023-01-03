import * as Flex from "@twilio/flex-ui";
import { ITask } from "@twilio/flex-ui";
import { isFeatureEnabled, getMatchingTaskConfiguration } from "../.."
import { TaskQualificationConfig } from "feature-library/agent-automation/types/ServiceConfiguration";

async function selectAndAcceptTask(task: ITask, taskConfig: TaskQualificationConfig) {
  const {
    sid, attributes: {direction}, taskChannelUniqueName
  } = task

  // we don't want to auto accept outbound voice tasks as they are already auto 
  // accepted
  if(taskChannelUniqueName === "voice" && direction === "outbound") return;

  // Select and accept the task per configuration
  if(taskConfig.auto_select) await Flex.Actions.invokeAction("SelectTask", { sid });
  if(taskConfig.auto_accept) await Flex.Actions.invokeAction("AcceptTask", { sid });
}

export default function autoSelectAndAcceptTask(task: ITask){
 
  if(!isFeatureEnabled()) return;

  const taskConfig = getMatchingTaskConfiguration(task);
  if(taskConfig) selectAndAcceptTask(task, taskConfig);
}
