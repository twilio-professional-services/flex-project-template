import React from 'react';
import { Actions, ITask, useFlexSelector } from '@twilio/flex-ui';
import { Text } from '@twilio-paste/text';
import { Button } from '@twilio-paste/core/button';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { Tr, Td } from '@twilio-paste/table';
import { Flex } from '@twilio-paste/flex';
import { Tooltip } from '@twilio-paste/tooltip';

interface ResponseProps {
  label: string;
  text: string;
  task: ITask;
}

const Response: React.FunctionComponent<ResponseProps> = ({ text, task }) => {
  const inputState = useFlexSelector(
    (state) => state.flex.chat.conversationInput[task.attributes.conversationSid].inputText,
  );

  const onClickSend = async () => {
    if (!task.attributes.conversationSid) return;
    await Actions.invokeAction('SendMessage', { body: text, conversationSid: task.attributes.conversationSid });
    Actions.invokeAction('SetInputText', {
      body: inputState,
      conversationSid: task.attributes.conversationSid,
    });
  };

  const onClickInsert = () => {
    if (!task.attributes.conversationSid) return;
    let currentInput = inputState;
    if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
      currentInput += ' ';
    }
    Actions.invokeAction('SetInputText', {
      body: currentInput + text,
      conversationSid: task.attributes.conversationSid,
    });
  };

  return (
    <Tr>
      <Td>
        <Text as="p" color="colorText" marginBottom="space10" marginTop="space10">
          {text}
        </Text>
      </Td>
      <Td>
        <Flex width="100%" hAlignContent={'right'}>
          <Flex marginRight="space40">
            <Tooltip text="Insert">
              <Button variant="secondary" onClick={() => onClickInsert()} size="circle_small">
                <EditIcon decorative />
              </Button>
            </Tooltip>
          </Flex>
          <Tooltip text="Send">
            <Button variant="primary" onClick={async () => onClickSend()} size="circle_small">
              <SendIcon decorative />
            </Button>
          </Tooltip>
        </Flex>
      </Td>
    </Tr>
  );
};

export default Response;
