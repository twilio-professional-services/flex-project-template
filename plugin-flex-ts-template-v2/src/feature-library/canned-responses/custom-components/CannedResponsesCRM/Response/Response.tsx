import React from 'react';
import { Actions, ITask, useFlexSelector } from '@twilio/flex-ui';
import { Text } from '@twilio-paste/text';
import { Button } from '@twilio-paste/core/button';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { Tr, Td } from '@twilio-paste/table';
import { Flex } from '@twilio-paste/flex';
import { Tooltip } from '@twilio-paste/tooltip';

import { replaceStringAttributes } from '../../../../../utils/helpers';

interface ResponseProps {
  label: string;
  text: string;
  task: ITask;
}

const Response: React.FunctionComponent<ResponseProps> = ({ text, task }) => {
  const conversationSid = task?.attributes?.conversationSid ?? task?.attributes?.channelSid;
  const inputState = useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);
  const parsedText = replaceStringAttributes(text, task);

  const onClickSend = async () => {
    if (!conversationSid) return;
    await Actions.invokeAction('SendMessage', {
      body: parsedText,
      conversationSid,
    });
    Actions.invokeAction('SetInputText', {
      body: inputState,
      conversationSid,
      selectionStart: inputState.length,
      selectionEnd: inputState.length,
    });
  };

  const onClickInsert = () => {
    if (!conversationSid) return;
    let currentInput = inputState;
    if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
      currentInput += ' ';
    }
    currentInput += parsedText;
    Actions.invokeAction('SetInputText', {
      body: currentInput,
      conversationSid,
      selectionStart: currentInput.length,
      selectionEnd: currentInput.length,
    });
  };

  return (
    <Tr>
      <Td>
        <Text as="p" color="colorText" marginBottom="space10" marginTop="space10">
          {parsedText}
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
