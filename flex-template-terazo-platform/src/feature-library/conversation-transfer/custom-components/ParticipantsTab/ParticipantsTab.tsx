import * as Flex from '@twilio/flex-ui';
import { useState, useEffect } from 'react';
import { Stack } from '@twilio-paste/core';
import { ConversationState, styled, Actions } from '@twilio/flex-ui';

import { Participants } from './Participants.tsx/Participants';
import { InviteParticipant } from './InviteParticipant/InviteParticipant';
import { InvitedParticipants } from './InvitedParticipants/InvitedParticipants';
import { ParticipantDetails } from '../../types/ParticipantDetails';
import { InvitedParticipantDetails } from '../../types/InvitedParticipantDetails';
import { getUpdatedParticipantDetails, getUpdatedInvitedParticipantDetails } from './hooks';
import {
  checkAndRemoveOldInvitedParticipants,
  countOfOutstandingInvitesForConversation,
} from '../../helpers/inviteTracker';
import {
  CancelChatParticipantInviteActionPayload,
  RemoveChatParticipantActionPayload,
} from '../../types/ActionPayloads';

const ParticipantsTabContainer = styled.div`
  padding-left: 3%;
  padding-right: 3%;
  padding-top: 3%;
  width: 100%;
`;

interface ParticipantsTabProps {
  task: Flex.ITask;
  conversation: ConversationState.ConversationState;
}

export const ParticipantsTab = ({ task, conversation }: ParticipantsTabProps) => {
  const [participantDetails, setParticipantDetails] = useState<ParticipantDetails[]>([]);
  const [invitedParticipantDetails, setInvitedParticipantDetails] = useState<InvitedParticipantDetails[]>([]);
  const [disableNewInvites, setDisableNewInvites] = useState<boolean>(false);

  useEffect(() => {
    const updateParticipants = () => {
      getUpdatedParticipantDetails(task, conversation, participantDetails).then((participantDetails) => {
        if (participantDetails) setParticipantDetails(participantDetails);
      });
    };

    const updateInvitedParticipants = () => {
      checkAndRemoveOldInvitedParticipants(task, conversation);
    };

    updateParticipants();
    updateInvitedParticipants();
    setInvitedParticipantDetails(getUpdatedInvitedParticipantDetails(conversation));

    // for now just allow one outstanding invite to simplify routing. conversation.attribute.invites supports muliple though
    if (countOfOutstandingInvitesForConversation(conversation)) setDisableNewInvites(true);
    else setDisableNewInvites(false);
  }, [conversation]);

  const handleKickParticipant = (interactionParticipantSid: string) => {
    const payload: RemoveChatParticipantActionPayload = { task, interactionParticipantSid };
    Actions.invokeAction('RemoveChatParticipant', payload);
  };

  const handleCancelInvite = (invitedParticipantDetails: InvitedParticipantDetails) => {
    const payload: CancelChatParticipantInviteActionPayload = {
      conversation,
      invitesTaskSid: invitedParticipantDetails.invitesTaskSid,
    };
    Actions.invokeAction('CancelChatParticipantInvite', payload);
  };

  return (
    <ParticipantsTabContainer>
      <Stack orientation="vertical" spacing="space40">
        <Participants participantDetails={participantDetails} handleKickParticipant={handleKickParticipant} />

        <InvitedParticipants
          invitedParticipantDetails={invitedParticipantDetails}
          handleCancelInvite={handleCancelInvite}
        />

        <InviteParticipant task={task} disableNewInvites={disableNewInvites} />
      </Stack>
    </ParticipantsTabContainer>
  );
};
