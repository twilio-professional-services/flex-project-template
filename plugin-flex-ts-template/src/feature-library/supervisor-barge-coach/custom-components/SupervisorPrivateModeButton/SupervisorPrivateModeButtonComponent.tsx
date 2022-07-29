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
    const coachingStatusPanel = this.props.coachingStatusPanel;
    const coaching = this.props.coaching;
    const { task } = this.props;
    const conference = task && task.conference;
    const conferenceSID = conference && conference.conferenceSid;

    if (coachingStatusPanel) {
      this.props.setBargeCoachStatus({ 
        coachingStatusPanel: false, 
      });
      // Updating the Sync Doc to reflect that we are no longer coaching and back into Monitoring
      SyncDoc.initSyncDoc(this.props.agentWorkerSID, conferenceSID, this.props.supervisorFN, "is Monitoring", "remove");
    } else {
      this.props.setBargeCoachStatus({ 
        coachingStatusPanel: true, 
      });
      // Updating the Sync Doc based on coaching status only if coaching is true
      // The Agent will pull this back within their Sync Doc to update the UI
      if(coaching) {
        // Updating the Sync Doc to reflect that we are now coaching the agent
        SyncDoc.initSyncDoc(this.props.agentWorkerSID, conferenceSID, this.props.supervisorFN, "is Coaching", "add");
      }
    }
  }

  // Render the Supervisor Private Mode Button to toggle if the supervisor wishes to remain private when
  // coaching the agent
  render() {
    const coachingStatusPanel = this.props.coachingStatusPanel;
    const task: any = this.props.task;

    const isLiveCall = TaskHelper.isLiveCall(task);

    return (
      <ButtonContainer>
        <IconButton
          icon={ coachingStatusPanel ? 'EyeBold' : 'Eye' }
          disabled={!isLiveCall}
          onClick={this.togglePrivateMode}
          themeOverride={this.props.theme?.CallCanvas.Button}
          title={ coachingStatusPanel ? "Enable Private Mode" : "Disable Private Mode" }
          style={ coachingStatusPanel ? buttonStyleActive : buttonStyle }
        />
        { coachingStatusPanel ? "Normal Mode" : "Private Mode" }
      </ButtonContainer>
    );
  }
}