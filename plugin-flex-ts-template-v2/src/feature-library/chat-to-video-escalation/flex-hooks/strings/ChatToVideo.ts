// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  FailedVideoLinkNotification = 'PS_FailedVideoLink'
}

export default {
  [StringTemplates.FailedVideoLinkNotification]: 'Unable to create the video room. Please try again.'
}
