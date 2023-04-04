import React from 'react';
import { Actions, TaskContext } from '@twilio/flex-ui';

import { Text } from '@twilio-paste/text';
import { Button } from '@twilio-paste/core/button';
import { CopyIcon } from '@twilio-paste/icons/esm/CopyIcon';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { Stack } from '@twilio-paste/core/stack';

interface ResponseProps {
  label: string;
  text: string;
}

const Response: React.FunctionComponent<ResponseProps> = ({ text }) => {
  const onClickSend = (conversationSid: string | undefined) => {
    if (!conversationSid) return;
    Actions.invokeAction('SendMessage', { body: text, conversationSid });
  };

  const onClickCopy = (conversationSid: string | undefined) => {
    if (!conversationSid) return;
    Actions.invokeAction('SetInputText', { body: text, conversationSid });
  };
  return (
    <TaskContext.Consumer>
      {(context: any) => (
        <>
          <Text as="p" color="colorText" marginBottom="space30" marginTop="space30">
            {text}
          </Text>
          <Stack orientation="horizontal" spacing="space60">
            <Button variant="secondary" onClick={() => onClickCopy(context.conversation?.source?.sid)}>
              <CopyIcon decorative title="Insert pre-canned response" />
              Insert
            </Button>
            <Button variant="primary" onClick={() => onClickSend(context.conversation?.source?.sid)}>
              <SendIcon decorative title="Send pre-canned response" />
              Send
            </Button>
          </Stack>
        </>
      )}
    </TaskContext.Consumer>
  );
};

export default Response;
