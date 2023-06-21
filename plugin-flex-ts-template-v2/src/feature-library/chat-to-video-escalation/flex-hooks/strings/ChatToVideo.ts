// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  FailedVideoLinkNotification = 'PSFailedVideoLink',
  VideoRoom = 'PSChatToVideoRoom',
  InviteMessage = 'PSChatToVideoInviteMessage',
  SwitchToVideo = 'PSChatToVideoSwitchToVideo',
  RemoteParticipant = 'PSChatToVideoRemoteParticipant',
  LocalParticipant = 'PSChatToVideoLocalParticipant',
  Connecting = 'PSChatToVideoConnecting',
  JoinVideoRoom = 'PSChatToVideoJoinVideoRoom',
  StopCamera = 'PSChatToVideoStopCamera',
  StartCamera = 'PSChatToVideoStartCamera',
  Disconnect = 'PSChatToVideoDisconnect',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.FailedVideoLinkNotification]: 'Unable to create the video room. Please try again.',
    [StringTemplates.VideoRoom]: 'Video Room',
    [StringTemplates.InviteMessage]: 'Please join me using this unique video link:',
    [StringTemplates.SwitchToVideo]: 'Switch to Video',
    [StringTemplates.RemoteParticipant]: 'Remote Participant',
    [StringTemplates.LocalParticipant]: 'Local Participant',
    [StringTemplates.Connecting]: 'Connecting...',
    [StringTemplates.JoinVideoRoom]: 'Join Video Room',
    [StringTemplates.StopCamera]: 'Stop Camera',
    [StringTemplates.StartCamera]: 'Start Camera',
    [StringTemplates.Disconnect]: 'Disconnect',
  },
});
