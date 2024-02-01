import React, { useEffect, useState } from 'react';
import { ITask, Manager, Template, templates } from '@twilio/flex-ui';
import { Flex } from '@twilio-paste/core/flex';

import { iframeStyle } from './styles';
import { StringTemplates } from '../../flex-hooks/strings/ChatToVideo';
import ChatToVideoService from '../../utils/ChatToVideoService';

interface VideoRoomProps {
  task: ITask;
}

const VideoRoom: React.FunctionComponent<VideoRoomProps> = ({ task }) => {
  const [activeRoom, setActiveRoom] = useState('');

  const identity = Manager.getInstance().store.getState().flex.session.identity;

  useEffect(() => {
    if (task?.attributes?.videoRoom && task.attributes.videoRoom !== activeRoom) {
      roomJoined(task.attributes.videoRoom);
    } else if (!task?.attributes?.videoRoom) {
      alert(`Error joining video: the incoming task is invalid. Please send a new link to your client.`);
    }
  }, [task.attributes.videoRoom]);

  function roomJoined(room: string) {
    console.log('chat-to-video-escalation: room joined: ', room);
    setActiveRoom(room);
  }

  if (!task) return null;

  return (
    <>
      {activeRoom ? (
        <iframe
          src={ChatToVideoService.generateUrl(identity, activeRoom)}
          allow="camera;microphone;display-capture;speaker-selection"
          style={iframeStyle}
        />
      ) : (
        <Flex padding="space50">
          <Template source={templates[StringTemplates.Connecting]} />
        </Flex>
      )}
    </>
  );
};

export default VideoRoom;
