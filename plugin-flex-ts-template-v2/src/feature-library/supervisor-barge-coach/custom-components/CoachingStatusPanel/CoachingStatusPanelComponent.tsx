import React from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/core/text';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

export const CoachingStatusPanel = () => {
  const { supervisorArray } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  // If the supervisor array has value in it, that means someone is coaching
  // We will map each of the supervisors that may be actively coaching
  // Otherwise we will not display anything if no one is actively coaching
  if (supervisorArray.length > 0) {
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
          {supervisorArray.map((supervisorArray: { supervisor: string }) => (
            <Text key={`${Math.random()}`} as="p" fontWeight="fontWeightMedium" color="colorTextSuccess">
              {supervisorArray.supervisor}
            </Text>
          ))}
        </Box>
      </Flex>
    );
  }
  return <></>;
};
