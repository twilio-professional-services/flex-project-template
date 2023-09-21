import React from "react";
import { LocalVideoTrack } from "twilio-video";
import { Text, Avatar } from "@twilio-paste/core";

import {
  AvatarContainer,
  InnerPreviewContainer,
  VideoPreviewContainer,
  OverlayContent,
} from "../../../styled";
import VideoPreviewTrack from "./VideoPreviewTrack/VideoPreviewTrack";

interface VideoPreviewProps {
  identity: string;
  localVideo?: LocalVideoTrack;
}

export default function VideoPreview({
  identity,
  localVideo,
}: VideoPreviewProps) {
  return (
    <VideoPreviewContainer>
      <InnerPreviewContainer>
        {!!localVideo && !localVideo.isStopped ? (
          <VideoPreviewTrack track={localVideo} />
        ) : (
          <AvatarContainer>
            <Avatar size={["sizeIcon70", "sizeIcon110"]} name={identity} />
          </AvatarContainer>
        )}
      </InnerPreviewContainer>
      <OverlayContent>
        <Text
          as="p"
          color="colorText"
          fontSize={["fontSize10", "fontSize20", "fontSize30"]}
        >
          {identity} (You)
        </Text>
      </OverlayContent>
    </VideoPreviewContainer>
  );
}
