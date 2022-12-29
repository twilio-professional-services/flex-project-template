import * as Flex from '@twilio/flex-ui';
import ConnectingParticipants from '../../custom-components/ConnectingParticipants';
import ParticipantActionsButtons from '../../custom-components/ParticipantActionsButtons';
import ParticipantName from '../../custom-components/ParticipantName';
import ParticipantStatus from '../../custom-components/ParticipantStatus';
import ParticipantStatusContainer from '../../custom-components/ParticipantStatusContainer';
import { isInternalCall } from '../../../internal-call/helpers/internalCall';
import { isFeatureEnabled, isAddButtonEnabled } from '../..';

export function addConferenceToParticipantCanvas(flex: typeof Flex) {

  if(!isFeatureEnabled()) return;
  
  const isUnknownParticipant = (props: any) => props.participant.participantType === 'unknown';
  const replaceButtons = (props: any) => {
    // if the add button is disabled, only the customer participant needs replacement buttons
    if (!isAddButtonEnabled() && props.participant.participantType !== 'customer') return false;
    
    return props.participant.participantType !== 'transfer' && !isInternalCall(props.task);
  };
  
  flex.ParticipantCanvas.Content.remove('actions', { if: replaceButtons });
  flex.ParticipantCanvas.Content.add(
    <ParticipantActionsButtons
      key="custom-actions"
    />, { sortOrder: 10, if: replaceButtons }
  );
  
  flex.ParticipantCanvas.ListItem.Content.remove('actions', { if: replaceButtons });
  flex.ParticipantCanvas.ListItem.Content.add(
    <ParticipantActionsButtons
      key="custom-actions"
    />, { sortOrder: 10, if: replaceButtons }
  );
  
  if (!isAddButtonEnabled()) return;
  // Everything below here is not relevant without the add button enabled
  
  flex.ParticipantCanvas.Content.remove('name', { if: isUnknownParticipant });
  flex.ParticipantCanvas.Content.add(
    <ParticipantName
      key="custom-name"
    />, { sortOrder: 1, if: isUnknownParticipant }
  );
  
  flex.ParticipantCanvas.Content.remove('status');
  flex.ParticipantCanvas.Content.add(
    <ParticipantStatus
      key="custom-status"
    />, { sortOrder: 2 }
  );
  
  flex.ParticipantCanvas.ListItem.Content.remove('statusContainer');
  flex.ParticipantCanvas.ListItem.Content.add(
    <ParticipantStatusContainer
      key="custom-statusContainer"
    />, { sortOrder: 1 }
  );
  
  // This is used for dynamically displaying 'connecting' conference participants
  flex.ParticipantsCanvas.Content.add(
    <ConnectingParticipants
      key="connecting-participants"
    />, { sortOrder: 1000 }
  );
}
