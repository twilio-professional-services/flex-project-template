import * as Flex from "@twilio/flex-ui";
import { addVideoRoomTabToTaskCanvasTabs } from "../../feature-library/chat-to-video-escalation/flex-hooks/components/TaskCanvasTabs";
import { addSupervisorMonitorPanel } from '../../feature-library/supervisor-barge-coach/flex-hooks/components/TaskCanvasTabs'

export default (flex: typeof Flex, manager: Flex.Manager) => {

    addSupervisorMonitorPanel(flex, manager);
    addVideoRoomTabToTaskCanvasTabs(flex);
    
}