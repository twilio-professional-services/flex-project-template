import React, { useState } from 'react';
import {
  Actions,
  ITask,
  Manager,
  ConversationState,
  Notifications,
  styled,
  IconButton,
  templates,
} from '@twilio/flex-ui';

import { updateTaskAttributesForVideo } from '../../helpers/taskAttributes';
import { getFeatureFlags } from '../../../../utils/configuration';
import { ChatToVideoNotification } from '../../flex-hooks/notifications/ChatToVideo';
import { StringTemplates } from '../../flex-hooks/strings/ChatToVideo';

interface SwitchToVideoProps {
  task: ITask;
  context?: any;
  conversation?: ConversationState.ConversationState;
}

const {
  serverless_functions_domain = '',
  serverless_functions_port = '',
  serverless_functions_protocol = '',
} = getFeatureFlags() || {};

const IconContainer = styled.div`
  margin: auto;
  padding-right: 0.8em;
`;

const SwitchToVideo: React.FunctionComponent<SwitchToVideoProps> = ({ task, conversation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);

    const { taskSid } = task;

    const body = {
      Token: Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token,
    };

    const options = {
      method: 'POST',
      body: new URLSearchParams(body),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };

    let serverlessDomain = serverless_functions_domain;
    let serverlessProtocol = 'https';

    if (serverless_functions_port) {
      serverlessDomain += `:${serverless_functions_port}`;
    }

    if (serverless_functions_protocol) {
      serverlessProtocol = serverless_functions_protocol;
    }

    await fetch(
      `${serverlessProtocol}://${serverlessDomain}/features/chat-to-video-escalation/generate-unique-code?taskSid=${taskSid}&protocol=${serverlessProtocol}`,
      options,
    )
      .then(async (response) => response.json())
      .then((response) => {
        console.log('SwitchToVideo: unique link created:', response);

        if (!response.full_url) {
          Notifications.showNotification(ChatToVideoNotification.FailedVideoLinkNotification);
          return;
        }

        Actions.invokeAction('SendMessage', {
          body: `${templates[StringTemplates.InviteMessage]()} ${response.full_url}`,
          conversation,
          messageAttributes: {
            hasVideo: true,
            videoUrl: response.full_url,
            uniqueCode: response.unique_code,
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    updateTaskAttributesForVideo(task, 'created');
  };

  return (
    <IconContainer>
      <IconButton
        icon="Video"
        key="chat-video-transfer-button"
        disabled={isLoading}
        onClick={onClick}
        variant="secondary"
        title={templates[StringTemplates.SwitchToVideo]()}
      />
    </IconContainer>
  );
};

export default SwitchToVideo;
