import React, { useState } from "react";
import { Actions, ITask, Manager, ConversationState, styled, IconButton } from "@twilio/flex-ui";

import { updateTaskAttributesForVideo } from "../../helpers/taskAttributes";
import { UIAttributes } from "types/manager/ServiceConfiguration";

interface SwitchToVideoProps {
  task: ITask;
  context?: any;
  conversation?: ConversationState.ConversationState;
}

const { custom_data } = Manager.getInstance().configuration as UIAttributes;
const {
  serverless_functions_domain = "",
  serverless_functions_port = "",
  serverless_functions_protocol = "",
} = custom_data || {};

const IconContainer = styled.div`
  margin: auto;
  padding-right: 0.8em;
`;

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
    <IconContainer>
        <IconButton
            icon="Video"
            key="chat-video-transfer-button"
            disabled={isLoading}
            onClick={async () => await onClick()}
            variant="secondary"
            title="Switch to Video"
            css='' />
    </IconContainer>
  );
};

export default SwitchToVideo;
