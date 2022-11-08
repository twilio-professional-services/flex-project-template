import React, { useState } from "react";
import { Actions, ITask, Manager } from "@twilio/flex-ui";
import { Flex, Button } from "@twilio-paste/core";
import { VideoOnIcon } from "@twilio-paste/icons/esm/VideoOnIcon";

import { updateTaskAttributesForVideo } from "../../helpers/taskAttributes";
import { UIAttributes } from "types/manager/ServiceConfiguration";

interface SwitchToVideoProps {
  task: ITask;
  context?: any;
}

const { custom_data } = Manager.getInstance().configuration as UIAttributes;
const { serverless_functions_domain = "" } = custom_data || {};

const SwitchToVideo: React.FunctionComponent<SwitchToVideoProps> = ({
  task,
  context,
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

    await fetch(
      `https://${serverless_functions_domain}/features/chat-to-video-escalation/generate-unique-code?taskSid=${taskSid}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("SwitchToVideo: unique link created:", response);
        return Actions.invokeAction("SendMessage", {
          body: `Please join me using this unique video link: ${response.full_url}`,
          conversationSid: channelSid,
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
