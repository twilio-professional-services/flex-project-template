import React from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/core/text';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoach';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

export const CoachingStatusPanel = () => {
  const { supervisorArray } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  // If the supervisor array has value in it, that means someone is coaching
  // We will map each of the supervisors that may be actively coaching
  // Otherwise we will not display anything if no one is actively coaching
  if (supervisorArray.length !== 0) {
    return (
      <Flex hAlignContent="center" vertical padding="space40">
        <Stack orientation="horizontal" spacing="space30" element="COACH_STATUS_PANEL_BOX">
          <Box backgroundColor="colorBackgroundPrimaryWeakest" padding="space40">
            <Template source={templates[StringTemplates.AgentCoachedBy]} />
            <Box>
              <ol>
                <Text
                  as="p"
                  fontWeight="fontWeightMedium"
                  fontSize="fontSize30"
                  marginBottom="space40"
                  color="colorTextSuccess"
                >
                  {supervisorArray.map((supervisorArray: { supervisor: string }) => (
                    <li key={`${Math.random()}`}>{supervisorArray.supervisor}</li>
                  ))}
                </Text>
              </ol>
            </Box>
          </Box>
        </Stack>
      </Flex>
    );
  }
  return <></>;
};
