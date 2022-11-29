import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { isInternalCall } from '../../helpers/internalCall';

const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.internal_call || {};

const taskReceivedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!enabled) return;

  if (!isInternalCall(task) || task.incomingTransferObject) {
    return;
  }
  
  Flex.Actions.invokeAction("AcceptTask", { task });
  Flex.Actions.invokeAction("SelectTask", { task });
};

export default taskReceivedHandler;
