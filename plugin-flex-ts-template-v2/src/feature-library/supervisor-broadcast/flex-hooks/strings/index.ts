export enum StringTemplates {
  BROADCAST_NOTIFICATION_TEMPLATE = 'PSSupervisorBroadcastTemplate',
  BROADCAST_SIDELINK = 'PSSupervisorBroadcastSideLink',
  BROADCAST_VIEW_TITLE = 'PSSupervisorBroadcastViewTitle',
  BROADCAST_FORM_TARGETWORKEREXPRESSION_LABEL = 'PSSupervisorBroadcastFormTargetWorkerExpressionLabel',
  BROADCAST_FORM_TARGETWORKEREXPRESSION_HELP_TEXT = 'PSSupervisorBroadcastFormTargetWorkerExpressionHelpText',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.BROADCAST_NOTIFICATION_TEMPLATE]: 'Message from supervisor: {{message}}',
    [StringTemplates.BROADCAST_SIDELINK]: 'Supervisor Broadcast',
    [StringTemplates.BROADCAST_VIEW_TITLE]: 'Send a Broadcast',
    [StringTemplates.BROADCAST_FORM_TARGETWORKEREXPRESSION_LABEL]: 'TargetWorkerExpression',
    [StringTemplates.BROADCAST_FORM_TARGETWORKEREXPRESSION_HELP_TEXT]: '1 == 1 to target everyone.',
  },
});
