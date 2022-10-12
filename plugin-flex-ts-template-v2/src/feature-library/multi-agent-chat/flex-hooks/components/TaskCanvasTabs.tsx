import * as Flex from '@twilio/flex-ui';
import { isFeatureEnabled } from '../../index'
import { Tab, TaskHelper } from "@twilio/flex-ui"
import { ParticipantTabLabel } from "../../custom-components/ParticipantTabLabel"
import ParticipantsTab from "../../custom-components/ParticipantsTab"

export function addTaskCanvasTabCustomization(flex: typeof Flex) {
    if (!isFeatureEnabled()) return;

    flex.TaskCanvasTabs.Content.add(
        <Tab label={ParticipantTabLabel()} key="participant-tab"><ParticipantsTab /></Tab>,
      { if: ({task}) => TaskHelper.isCBMTask(task) }
    )
}
