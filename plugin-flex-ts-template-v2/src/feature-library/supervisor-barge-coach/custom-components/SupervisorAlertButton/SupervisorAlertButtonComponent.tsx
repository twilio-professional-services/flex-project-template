import React, { useEffect } from 'react';
import { IconButton, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Tooltip } from '@twilio-paste/core';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { Actions } from '../../flex-hooks/states/SupervisorBargeCoach';
import { alertSupervisorsCheck, syncUpdates } from '../../helpers/supervisorAlertHelper';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

export const SupervisorAlertButton = () => {
  const dispatch = useDispatch();

  const { enableAgentAssistanceAlerts, agentAssistanceSyncSubscribed } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach,
  );

  const agentAssistanceAlertToggle = () => {
    if (enableAgentAssistanceAlerts) {
      dispatch(
        Actions.setBargeCoachStatus({
          enableAgentAssistanceAlerts: false,
        }),
      );
      // If the supervisor disabled the agent assistance alerts, let's cache this
      // to ensure it is set to false if a browser refresh happens
      alertSupervisorsCheck();
      localStorage.setItem('cacheAlerts', 'false');
    } else {
      dispatch(
        Actions.setBargeCoachStatus({
          enableAgentAssistanceAlerts: true,
        }),
      );
      alertSupervisorsCheck();
      localStorage.setItem('cacheAlerts', 'true');
    }
  };

  useEffect(() => {
    if (!agentAssistanceSyncSubscribed) {
      syncUpdates();
    }
  });
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
