import * as React from 'react';
import { IconButton, TaskHelper } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';
import { ContainerProps } from './SupervisorPrivateModeButtonContainer'

import { ButtonContainer, buttonStyle, buttonStyleActive } from './SupervisorPrivateModeButtonStyles';

// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync'

export interface OwnProps {
  task?: Flex.ITask;
  theme?: Flex.Theme;
}

export type Props = ContainerProps & OwnProps;

export default class SupervisorPrivateToggle extends React.Component<Props> {

  // We will toggle the private mode on/off based on the button click and the state
  // of the coachingStatusPanel along with udpating the Sync Doc appropriately
  togglePrivateMode = () => {
    const { task, coaching, barge, privateMode, agentWorkerSID, myWorkerSID, supervisorFN } = this.props;
    const conference = task && task.conference;
    const conferenceSID = conference && conference.conferenceSid;

    // If privateMode is true, toggle to false and update the Sync Doc with the appropriate Supervisor and Status
    if (privateMode) {
      this.props.setBargeCoachStatus({ 
        privateMode: false, 
      });
      if (coaching) {
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "is Coaching", "add");
      } else if (barge) {
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "has Joined", "add");
      } else {
        SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "is Monitoring", "add");
      }
    // If privateMode is false, toggle to true and remove the Supervisor from the Sync Doc
    } else {
      this.props.setBargeCoachStatus({ 
        privateMode: true, 
      });
      SyncDoc.initSyncDoc(agentWorkerSID, conferenceSID, myWorkerSID ,supervisorFN, "", "remove");
    }
  }

  // Render the Supervisor Private Mode Button to toggle if the supervisor wishes to remain private when
  // coaching the agent
  render() {
    const privateMode = this.props.privateMode;
    const task: any = this.props.task;

    const isLiveCall = TaskHelper.isLiveCall(task);

    return (
      <ButtonContainer>
        <IconButton
          icon={ privateMode ? 'EyeBold' : 'Eye' }
          disabled={!isLiveCall}
          onClick={this.togglePrivateMode}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={ privateMode ? "Disable Private Mode" : "Enable Private Mode" }
          style={ privateMode ? buttonStyle : buttonStyleActive }
        />
        { privateMode ? "Private Mode" : "Normal Mode" }
      </ButtonContainer>
    );
  }
}