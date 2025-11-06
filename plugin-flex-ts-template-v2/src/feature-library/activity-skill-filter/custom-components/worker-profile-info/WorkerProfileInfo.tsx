import { Actions, IWorker } from '@twilio/flex-ui';
import React, { ChangeEvent } from 'react';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Select, Option } from '@twilio-paste/core/select';
import { Activity } from 'types/task-router';

import AgentActivities from '../../utils/AgentActivities';

export interface OwnProps {
  worker?: IWorker;
}

export type Props = OwnProps;

function WorkerProfileInfo(props: Props) {
  if (props.worker === undefined) {
    return null;
  }

  const { worker } = props;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    Actions.invokeAction('SetWorkerActivity', { workerSid: worker.sid, activitySid: event.target.value });
  }

  const activities = AgentActivities.getEligibleActivities(worker);
  const currentActivity = activities.find((activity) => activity.name === worker.activityName);

  return (
    <Flex vertical grow marginRight="space50" vAlignContent="center">
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
    </Flex>
  );
}

export default WorkerProfileInfo;
