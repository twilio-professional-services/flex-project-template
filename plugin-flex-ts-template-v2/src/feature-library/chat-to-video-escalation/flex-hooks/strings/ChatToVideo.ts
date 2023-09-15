// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  FailedVideoLinkNotification = 'PSFailedVideoLink',
  VideoRoom = 'PSChatToVideoRoom',
  InviteMessage = 'PSChatToVideoInviteMessage',
  SwitchToVideo = 'PSChatToVideoSwitchToVideo',
  Connecting = 'PSChatToVideoConnecting',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.FailedVideoLinkNotification]: 'Unable to create the video room. Please try again.',
    [StringTemplates.VideoRoom]: 'Video Room',
    [StringTemplates.InviteMessage]: 'Please join me using this unique video link:',
    [StringTemplates.SwitchToVideo]: 'Switch to Video',
    [StringTemplates.Connecting]: 'Connecting...',
  },
});
