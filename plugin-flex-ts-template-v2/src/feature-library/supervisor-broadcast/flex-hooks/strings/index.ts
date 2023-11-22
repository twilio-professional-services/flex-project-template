export enum StringTemplates {
  BROADCAST_NOTIFICATION_TEMPLATE = 'PSSupervisorBroadcastTemplate',
  BROADCAST_SIDELINK = 'PSSupervisorBroadcastSideLink',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.BROADCAST_NOTIFICATION_TEMPLATE]: 'Message from supervisor: {{message}}',
    [StringTemplates.BROADCAST_SIDELINK]: 'Supervisor Broadcast',
  },
});
