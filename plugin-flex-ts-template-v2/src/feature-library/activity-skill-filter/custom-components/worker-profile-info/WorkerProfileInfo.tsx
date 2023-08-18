import * as Flex from '@twilio/flex-ui';
import React, { ChangeEvent } from 'react';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { Select, Option } from '@twilio-paste/core/select';
import { Stack } from '@twilio-paste/core/stack';
import { Activity } from 'types/task-router';

import AgentActivities from '../../utils/AgentActivities';

export interface OwnProps {
  worker?: Flex.IWorker;
}

export type Props = OwnProps;

function WorkerProfileInfo(props: Props) {
  if (props.worker === undefined) {
    return null;
  }

  const { worker } = props;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    Flex.Actions.invokeAction('SetWorkerActivity', { workerSid: worker.sid, activitySid: event.target.value });
  }

  const activities = AgentActivities.getEligibleActivities(worker);
  const currentActivity = activities.find((activity) => activity.name === worker.activityName);

  return (
    <Flex.FlexBoxColumn>
      <Box marginTop="space30" marginRight="space50">
        <Stack orientation="vertical" spacing="space50">
          <Heading as="div" variant="heading50">
            {worker.fullName}
          </Heading>
          <Select id="workerProfileSelect" value={currentActivity?.sid} onChange={handleChange}>
            {activities.map((activity: Activity) => (
              <Option value={activity.sid} key={activity.sid}>
                {activity.name}
              </Option>
            ))}
          </Select>
        </Stack>
      </Box>
    </Flex.FlexBoxColumn>
  );
}

export default WorkerProfileInfo;
