import * as Flex from "@twilio/flex-ui";
import SwitchToVideo from "../../custom-components/SwitchToVideo";
import { isFeatureEnabled } from '../..';

export function addSwitchToVideoToTaskCanvasHeader(flex: typeof Flex) {
  if (!isFeatureEnabled()) return;

  flex.TaskCanvasHeader.Content.add(<SwitchToVideo key="switch-to-video" />, {
    sortOrder: 10,
    if: (props: any) => flex.TaskHelper.isChatBasedTask(props.task),
  });
}
