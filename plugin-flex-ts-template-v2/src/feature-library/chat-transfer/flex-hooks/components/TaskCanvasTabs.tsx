import * as Flex from '@twilio/flex-ui';
import { isMultiParticipantEnabled } from '../../index'
import { Tab, TaskHelper } from "@twilio/flex-ui"
import { ParticipantTabLabel } from "../../custom-components/ParticipantTabLabel"
import ParticipantsTab from "../../custom-components/ParticipantsTab"

export function addTaskCanvasTabCustomization(flex: typeof Flex) {
    if (!isMultiParticipantEnabled()) return;

    flex.TaskCanvasTabs.Content.add(
        <Tab label={ParticipantTabLabel()} key="participant-tab"><ParticipantsTab /></Tab>,
      { if: ({task}) => TaskHelper.isCBMTask(task) && task.status === "accepted" }
    )
}
