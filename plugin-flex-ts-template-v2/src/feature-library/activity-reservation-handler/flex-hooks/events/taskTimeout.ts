import * as Flex from "@twilio/flex-ui";
import taskEndedHandler from "../../helpers/taskEndedHandler";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from '../..';

const taskTimeoutHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;
  
  taskEndedHandler(task, flexEvent);
};

export default taskTimeoutHandler;
