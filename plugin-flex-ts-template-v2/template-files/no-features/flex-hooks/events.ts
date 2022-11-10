import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../types/manager/FlexEvent";

const eventHandlers: Record<FlexEvent, ((...args: any[]) => void)[]> = {
  pluginsLoaded: [],
  taskAccepted: [],
  taskCanceled: [],
  taskCompleted: [],
  taskReceived: [],
  taskRejected: [],
  taskRescinded: [],
  taskTimeout: [],
  taskUpdated: [],
  taskWrapup: [],
  tokenUpdated: []
};

export default eventHandlers;
