import * as Flex from "@twilio/flex-ui";
import SwitchToVideo from "../../custom-components/SwitchToVideo";

import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration
  .ui_attributes as UIAttributes;
const { enabled = false } =
  custom_data?.features?.chat_to_video_escalation || {};

export function addSwitchToVideoToTaskCanvasHeader(flex: typeof Flex) {
  if (!enabled) return;

  flex.TaskCanvasHeader.Content.add(<SwitchToVideo key="switch-to-video" />, {
    sortOrder: 10,
    if: (props: any) => flex.TaskHelper.isChatBasedTask(props.task),
  });
}
