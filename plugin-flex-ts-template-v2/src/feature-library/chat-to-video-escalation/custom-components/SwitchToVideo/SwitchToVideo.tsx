import React, { useState } from "react";
import { Actions, ITask, Manager, ConversationState, Notifications } from "@twilio/flex-ui";
import { Flex, Button } from "@twilio-paste/core";
import { VideoOnIcon } from "@twilio-paste/icons/esm/VideoOnIcon";

import { updateTaskAttributesForVideo } from "../../helpers/taskAttributes";
import { getFeatureFlags } from '../../../../utils/configuration';
import { ChatToVideoNotification } from '../../flex-hooks/notifications/ChatToVideo';

interface SwitchToVideoProps {
  task: ITask;
  context?: any;
  conversation?: ConversationState.ConversationState;
}

const {
  serverless_functions_domain = "",
  serverless_functions_port = "",
  serverless_functions_protocol = "",
} = getFeatureFlags() || {};

const SwitchToVideo: React.FunctionComponent<SwitchToVideoProps> = ({
  task,
  context,
  conversation
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);

    const taskSid = task.taskSid;
    const channelSid = task.attributes.conversationSid;

    const body = {
      Token:
        Manager.getInstance().store.getState().flex.session.ssoTokenPayload
          .token,
    };

    const options = {
      method: "POST",
      body: new URLSearchParams(body),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    };
    
    let serverlessDomain = serverless_functions_domain;
    let serverlessProtocol = "https";
    
    if (serverless_functions_port) {
      serverlessDomain += ":" + serverless_functions_port;
    }
    
    if (serverless_functions_protocol) {
      serverlessProtocol = serverless_functions_protocol;
    }

    await fetch(
      `${serverlessProtocol}://${serverlessDomain}/features/chat-to-video-escalation/generate-unique-code?taskSid=${taskSid}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("SwitchToVideo: unique link created:", response);
        
        if (!response.full_url) {
          Notifications.showNotification(ChatToVideoNotification.FailedVideoLinkNotification);
          return;
        }
        
        return Actions.invokeAction("SendMessage", {
          body: `Please join me using this unique video link: ${response.full_url}`,
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

    updateTaskAttributesForVideo(task, "created");
  };

  return (
    <Flex padding="space10" marginTop="space30" marginLeft={"space30"}>
      <Button
        variant="primary"
        onClick={async () => await onClick()}
        loading={isLoading}
      >
        <VideoOnIcon decorative size="sizeIcon10" title="Switch to Video" />
      </Button>
    </Flex>
  );
};

export default SwitchToVideo;
