export enum StringTemplates {
  BROADCAST_NOTIFICATION_TEMPLATE = 'PSSupervisorBroadcastTemplate',
  BROADCAST_SIDELINK = 'PSSupervisorBroadcastSideLink',
  BROADCAST_VIEW_TITLE = 'PSSupervisorBroadcastViewTitle',
  BROADCAST_FORM_TARGETWORKEREXPRESSION_LABEL = 'PSSupervisorBroadcastFormTargetWorkerExpressionLabel',
  BROADCAST_FORM_TARGETWORKEREXPRESSION_HELP_TEXT = 'PSSupervisorBroadcastFormTargetWorkerExpressionHelpText',
  BROADCAST_FORM_COMPOSEMESSAGE_LABEL = 'PSSupervisorBroadcastFormComposeMessageLabel',
  BROADCAST_FORM_COMPOSEMESSAGE_HELP_TEXT = 'PSSupervisorBroadcastFormComposeMessageHelpText',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.BROADCAST_NOTIFICATION_TEMPLATE]: 'Message from supervisor: {{message}}',
    [StringTemplates.BROADCAST_SIDELINK]: 'Supervisor Broadcast',
    [StringTemplates.BROADCAST_VIEW_TITLE]: 'Send a Broadcast',
    [StringTemplates.BROADCAST_FORM_TARGETWORKEREXPRESSION_LABEL]: 'TargetWorkerExpression',
    [StringTemplates.BROADCAST_FORM_TARGETWORKEREXPRESSION_HELP_TEXT]: '1 == 1 to target everyone.',
    [StringTemplates.BROADCAST_FORM_COMPOSEMESSAGE_LABEL]: 'Compose your Message',
    [StringTemplates.BROADCAST_FORM_COMPOSEMESSAGE_HELP_TEXT]: 'This message will be sent to everyone in the preview.',
  },
});
