import React from 'react';
import { ITask, Template, templates } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/core/text';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

type SupervisorBargeCoachProps = {
  task?: ITask;
};

export const CoachingStatusPanel = ({ task }: SupervisorBargeCoachProps) => {
  const { supervisorArray } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const filterSupervisors = (supervisor: any) =>
    supervisor.conference === task?.conference?.conferenceSid ||
    supervisor.conference === task?.attributes?.conference?.sid;

  // If the supervisor array has value in it for this conference, that means someone is coaching
  if (supervisorArray.filter(filterSupervisors).length > 0) {
    return (
      <Flex hAlignContent="center" vertical padding="space40">
        <Box
          backgroundColor="colorBackgroundPrimaryWeakest"
          borderColor="colorBorderPrimaryWeaker"
          borderRadius="borderRadius30"
          borderStyle="solid"
          borderWidth="borderWidth10"
          padding="space40"
        >
          <Template source={templates[StringTemplates.AgentCoachedBy]} />
          {supervisorArray.filter(filterSupervisors).map((supervisor: any) => (
            <Text key={`${Math.random()}`} as="p" fontWeight="fontWeightMedium" color="colorTextSuccess">
              {supervisor.supervisor}
            </Text>
          ))}
        </Box>
      </Flex>
    );
  }
  return <></>;
};
