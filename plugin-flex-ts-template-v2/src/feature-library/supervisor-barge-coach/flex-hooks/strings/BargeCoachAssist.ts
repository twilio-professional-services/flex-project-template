import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AgentAssistanceNotification = 'PSBargeCoachAgentAssistanceTriggered',
  AssistanceRequired = 'PSBargeCoachAssistanceRequired',
  TurnOffAssistance = 'PSBargeCoachTurnOffAssistance',
  AskForAssistance = 'PSBargeCoachAskForAssistance',
  AgentSeekingAssistance = 'PSBargeCoachAgentSeekingAssistance',
  BargeIn = 'PSBargeCoachBargeIn',
  BargeOut = 'PSBargeCoachBargeOut',
  DisableCoach = 'PSBargeCoachDisableCoach',
  EnableCoach = 'PSBargeCoachEnableCoach',
  AgentCoachedBy = 'PSBargeCoachAgentCoachedBy',
  AssistanceAlertsEnabled = 'PSBargeCoachAssistanceAlertsEnabled',
  AssistanceAlertsDisabled = 'PSBargeCoachAssistanceAlertsDisabled',
  ActiveSupervisors = 'PSBargeCoachActiveSupervisors',
  None = 'PSBargeCoachNone',
  EnablePrivacy = 'PSBargeCoachEnablePrivacy',
  DisablePrivacy = 'PSBargeCoachDisablePrivacy',
  PrivacyOn = 'PSBargeCoachPrivacyOn',
  PrivacyOff = 'PSBargeCoachPrivacyOff',
  PanelBarge = 'PSBargeCoachMonitorPanelBarge',
  PanelCoaching = 'PSBargeCoachMonitorPanelCoaching',
  PanelMonitoring = 'PSBargeCoachMonitorPanelMonitoring',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AgentAssistanceNotification]: '{{agentFN}} is seeking assistance.',
    [StringTemplates.AssistanceRequired]: 'Assistance Required',
    [StringTemplates.TurnOffAssistance]: 'Turn off assistance',
    [StringTemplates.AskForAssistance]: 'Ask for assistance',
    [StringTemplates.AgentSeekingAssistance]: 'Agent seeking assistance',
    [StringTemplates.BargeIn]: 'Barge In',
    [StringTemplates.BargeOut]: 'Barge Out',
    [StringTemplates.DisableCoach]: 'Disable Coach Mode',
    [StringTemplates.EnableCoach]: 'Enable Coach Mode',
    [StringTemplates.AgentCoachedBy]: 'You are being coached by:',
    [StringTemplates.AssistanceAlertsEnabled]: 'Agent Assistance Alerts Enabled',
    [StringTemplates.AssistanceAlertsDisabled]: 'Agent Assistance Alerts Disabled',
    [StringTemplates.ActiveSupervisors]: 'Active Supervisors:',
    [StringTemplates.None]: 'None',
    [StringTemplates.EnablePrivacy]: 'Enable Private Mode',
    [StringTemplates.DisablePrivacy]: 'Disable Private Mode',
    [StringTemplates.PrivacyOn]: 'Privacy On',
    [StringTemplates.PrivacyOff]: 'Privacy Off',
    [StringTemplates.PanelBarge]: '{{supervisor}} has joined',
    [StringTemplates.PanelCoaching]: '{{supervisor}} is coaching',
    [StringTemplates.PanelMonitoring]: '{{supervisor}} is monitoring',
  },
  'es-ES': esES,
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
