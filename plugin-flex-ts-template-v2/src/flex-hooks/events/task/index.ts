import * as Flex from "@twilio/flex-ui";
import TaskAccepted from "./TaskAccepted";
import TaskCanceled from "./TaskCanceled";
import TaskCompleted from "./TaskCompleted";
import TaskReceived from "./TaskReceived";
import TaskRejected from "./TaskRejected";
import TaskRescinded from "./TaskRescinded";
import TaskTimeout from "./TaskTimeout";
import TaskUpdated from "./TaskUpdated";
import TaskWrapup from "./TaskWrapup";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  TaskAccepted(flex, manager);
  TaskCanceled(flex, manager);
  TaskCompleted(flex, manager);
  TaskReceived(flex, manager);
  TaskRejected(flex, manager);
  TaskRescinded(flex, manager);
  TaskTimeout(flex, manager);
  TaskUpdated(flex, manager);
  TaskWrapup(flex, manager);
};








