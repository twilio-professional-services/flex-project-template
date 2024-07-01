import { Button } from '@twilio-paste/core/button';
import { Heading } from '@twilio-paste/core/heading';
import { Stack } from '@twilio-paste/core/stack';
import { Card } from '@twilio-paste/core/card';
import { Flex } from '@twilio-paste/core/flex';
import { FC } from 'react';

export interface RuleListEmptyProps {
  canAddNew: boolean;
  handleNewRule: () => void;
}

const RuleListEmpty: FC<RuleListEmptyProps> = (props) => {
  return (
    <Card padding={'space150'}>
      <Flex hAlignContent={'center'}>
        <Stack orientation={'vertical'} spacing={'space70'}>
          <Flex hAlignContent={'center'}>
            <Heading as="h2" variant="heading20" marginBottom="space0">
              {props.canAddNew ? "✨ Now let's create an activation rule" : '🍩 No Activation Rules'}
            </Heading>
          </Flex>
          <Flex hAlignContent={'center'}>
            {props.canAddNew
              ? 'Start collecting data from customers by mapping queues to surveys.'
              : 'Start by adding and saving a survey, then you will be able to create an activation rule to link a survey to a queue.'}
          </Flex>
          <Flex hAlignContent={'center'}>
            <Button variant="primary" onClick={props.handleNewRule} disabled={!props.canAddNew}>
              ✨ Create new activation rule
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
export default RuleListEmpty;
