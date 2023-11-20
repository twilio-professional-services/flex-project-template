export enum StringTemplates {
  BROADCAST_NOTIFICATION_TEMPLATE = 'PSSupervisorBroadcastTemplate',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.BROADCAST_NOTIFICATION_TEMPLATE]: 'Message from supervisor: {{message}}',
  },
});
