export const getChannelIcon = (channelName: string) => {
  const channelIcons: { [key: string]: string } = {
    voice: 'Call',
    chat: 'Message',
    sms: 'Sms',
    video: 'Video',
    default: 'GenericTask',
    email: 'SendLarge',
  };
  return channelIcons[channelName.toLowerCase()];
};
