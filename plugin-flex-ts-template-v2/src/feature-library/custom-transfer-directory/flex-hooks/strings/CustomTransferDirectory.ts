export enum StringTemplates {
  FailedToLoadInsightsClient = 'PSFailedToLoaddInsightsClient',
  FailedToLoadInsightsData = 'PSFailedToLoadInsightsData',
}

export const stringHook = () => ({
  [StringTemplates.FailedToLoadInsightsClient]: 'Failed to load real time insights client. All queues are listed',
  [StringTemplates.FailedToLoadInsightsData]: 'Unable to load real time insights data. All queues are listed',
});
