import React, { useEffect } from 'react';
import { IconButton, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Tooltip } from '@twilio-paste/core/tooltip';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { setBargeCoachStatus } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { alertSupervisorsCheck } from '../../helpers/supervisorAlertHelper';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

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
        <IconButton
          icon={enableAgentAssistanceAlerts ? 'BellBold' : 'Bell'}
          onClick={() => agentAssistanceAlertToggle()}
          size="small"
          style={{ backgroundColor: 'transparent' }}
        />
      </Flex>
    </Tooltip>
  );
};
