import React, { useEffect, useState } from 'react';
import { ITask, Manager, MessagingCanvas, styled, withTaskContext } from '@twilio/flex-ui';
import { useUID } from '@twilio-paste/core/uid-library';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { LinkExternalIcon } from '@twilio-paste/icons/esm/LinkExternalIcon';
import { Box } from '@twilio-paste/core/box';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Button } from '@twilio-paste/core/button';
import { Table, Tr, TBody, Td } from '@twilio-paste/core/table';
import { Modal, ModalBody, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Spinner } from '@twilio-paste/core/spinner';

import ConversationHistoryService from '../helpers/ConversationHistoryService';
import ParticipantConversation from '../types/ParticipantConversation';

const MessagingCanvasWrapper = styled('div')`
  .Twilio-MessagingCanvas {
    height: auto;
  }
`;

export interface OwnProps {
  task?: ITask;
}

const ConversationHistory = ({ task }: OwnProps) => {
  const [conversations, setConversations] = useState([] as ParticipantConversation[]);
  const [peekConversationSid, setPeekConversationSid] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const modalHeadingID = useUID();

  const fetchConversationHistory = async (task: ITask) => {
    try {
      setIsLoading(true);
      // Call the serverless function to get conversation history
      const response = await ConversationHistoryService.getConversationHistory(task.attributes.from);

      if (response.success) {
        setConversations(response.conversations);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // This will update the conversation history list based on the selected task
    if (!task) {
      setConversations([]);
      return;
    }
    fetchConversationHistory(task);
  }, [task?.taskSid]);

  const closeModal = () => setPeekConversationSid('');

  return (
    <Flex vertical grow hAlignContent="between">
      {isLoading && (
        <Flex hAlignContent="center">
          <Box padding="space80">
            <Spinner decorative={false} title="Loading" size="sizeIcon80" />
          </Box>
        </Flex>
      )}
      {!isLoading && conversations?.length < 1 && (
        <Flex hAlignContent="center">
          <Box padding="space80">This contact has no history.</Box>
        </Flex>
      )}
      <Box overflowY="auto">
        <Table variant="borderless" striped>
          <TBody>
            {conversations
              .filter((conversation) => conversation.conversationSid != task?.attributes.conversationSid)
              .sort((a, b) => (new Date(a.conversationDateCreated) < new Date(b.conversationDateCreated) ? 1 : -1))
              .map((conversation) => (
                <Tr key={conversation.conversationSid}>
                  <Td>
                    <Stack orientation="horizontal" spacing="space30">
                      <ChatIcon decorative={true} size="sizeIcon10" />
                      {new Date(conversation.conversationDateCreated).toLocaleString()}
                    </Stack>
                  </Td>
                  <Td textAlign="right">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setPeekConversationSid(conversation.conversationSid)}
                    >
                      <LinkExternalIcon decorative={true} /> Open
                    </Button>
                  </Td>
                </Tr>
              ))}
          </TBody>
        </Table>
      </Box>
      <Modal
        ariaLabelledby={modalHeadingID}
        isOpen={Boolean(peekConversationSid)}
        onDismiss={closeModal}
        size="default"
      >
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            Previous conversation
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <MessagingCanvasWrapper>
            <MessagingCanvas autoInitConversation={true} sid={peekConversationSid} />
          </MessagingCanvasWrapper>
        </ModalBody>
      </Modal>
    </Flex>
  );
};

export default withTaskContext(ConversationHistory);
