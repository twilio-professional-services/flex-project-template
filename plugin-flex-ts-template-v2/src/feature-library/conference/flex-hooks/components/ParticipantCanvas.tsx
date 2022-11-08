import * as Flex from '@twilio/flex-ui';
import ConnectingParticipants from '../../custom-components/ConnectingParticipants';
import ParticipantActionsButtons from '../../custom-components/ParticipantActionsButtons';
import ParticipantName from '../../custom-components/ParticipantName';
import ParticipantStatus from '../../custom-components/ParticipantStatus';
import ParticipantStatusContainer from '../../custom-components/ParticipantStatusContainer';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features?.conference || {}

export function addConferenceToParticipantCanvas(flex: typeof Flex) {

  if(!enabled) return;
  
  const isUnknownParticipant = (props: any) => props.participant.participantType === 'unknown';
  const isNotTransferParticipant = (props: any) => props.participant.participantType !== 'transfer';
  
  // This section is for the full width ParticipantCanvas
  flex.ParticipantCanvas.Content.remove('actions', { if: isNotTransferParticipant });
  flex.ParticipantCanvas.Content.add(
    <ParticipantActionsButtons
      key="custom-actions"
    />, { sortOrder: 10, if: isNotTransferParticipant }
  );
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
  
  // This section is for the narrow width ParticipantCanvas, which changes to List Mode,
  // introduced in Flex 1.11.0. ListItem did not exist on ParticipantCanvas before 1.11.0.
  if (flex.ParticipantCanvas.ListItem) {
    flex.ParticipantCanvas.ListItem.Content.remove('statusContainer');
    flex.ParticipantCanvas.ListItem.Content.add(
      <ParticipantStatusContainer
        key="custom-statusContainer"
      />, { sortOrder: 1 }
    );
    flex.ParticipantCanvas.ListItem.Content.remove('actions', { if: isNotTransferParticipant });
    flex.ParticipantCanvas.ListItem.Content.add(
      <ParticipantActionsButtons
        key="custom-actions"
      />, { sortOrder: 10, if: isNotTransferParticipant }
    );
  }
  
  // This is used for dynamically displaying 'connecting' conference participants
  flex.ParticipantsCanvas.Content.add(
    <ConnectingParticipants
      key="connecting-participants"
    />, { sortOrder: 1000 }
  );
}
