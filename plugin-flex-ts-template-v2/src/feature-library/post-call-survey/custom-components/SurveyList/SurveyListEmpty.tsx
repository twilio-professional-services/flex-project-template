import { Button } from '@twilio-paste/core/button';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Stack } from '@twilio-paste/core/stack';
import { Flex } from '@twilio-paste/core/flex';
import { FC } from 'react';

export interface SurveyListProps {
  canAddNew: boolean;
  handleNewSurvey: () => void;
}

const SurveyListEmpty: FC<SurveyListProps> = (props) => {
  return (
    <Card padding={'space150'}>
      <Flex hAlignContent={'center'}>
        <Stack orientation={'vertical'} spacing={'space70'}>
          <Flex hAlignContent={'center'}>
            <Heading as="h2" variant="heading20" marginBottom="space0">
              🍿 Let's create your first survey
            </Heading>
          </Flex>
          <Flex hAlignContent={'center'}>
            Start collecting user feedback in minutes. Start by creating a set of simple questions.
          </Flex>
          <Flex hAlignContent={'center'}>
            <Button variant="primary" onClick={props.handleNewSurvey} disabled={!props.canAddNew}>
              ✨ Create new survey
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
export default SurveyListEmpty;
