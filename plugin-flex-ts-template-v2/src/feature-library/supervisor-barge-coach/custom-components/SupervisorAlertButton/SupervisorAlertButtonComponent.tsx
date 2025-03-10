import React, { useEffect } from 'react';
import { IconButton, styled, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Tooltip } from '@twilio-paste/core/tooltip';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { setBargeCoachStatus } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { alertSupervisorsCheck } from '../../helpers/supervisorAlertHelper';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

interface ThemeOnlyProps {
  theme?: any;
}

const AssistanceAlertIconButton = styled(IconButton)<ThemeOnlyProps>`
  padding: ${({ theme }) => theme.tokens.spacings.space30};
  :hover {
    background-color: ${({ theme }) => theme.tokens.backgroundColors.colorBackgroundStronger};
  }
`;

export const SupervisorAlertButton = () => {
  const dispatch = useDispatch();

  const { enableAgentAssistanceAlerts } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  useEffect(() => {
    alertSupervisorsCheck();
    // Cache the value so it can be restored after a refresh
    localStorage.setItem('cacheAlerts', `${enableAgentAssistanceAlerts}`);
  }, [enableAgentAssistanceAlerts]);

  const agentAssistanceAlertToggle = () => {
    dispatch(
      setBargeCoachStatus({
        enableAgentAssistanceAlerts: !enableAgentAssistanceAlerts,
      }),
    );
  };

  // Return the Supervisor Agent Assistance Toggle, this gives the supervisor
  // the option to enable or disable Agent Assistance Alerts
  return (
    <Tooltip
      text={
        enableAgentAssistanceAlerts
          ? templates[StringTemplates.AssistanceAlertsEnabled]()
          : templates[StringTemplates.AssistanceAlertsDisabled]()
      }
      placement="left"
    >
      <Flex vAlignContent="center">
        <AssistanceAlertIconButton
          icon={enableAgentAssistanceAlerts ? 'HelpBold' : 'Help'}
          onClick={() => agentAssistanceAlertToggle()}
        />
      </Flex>
    </Tooltip>
  );
};
