import React from "react";
import { styled, css } from "@twilio-paste/styling-library";
import { Stack, Text, Avatar } from "@twilio-paste/core";
import {
  Participant as IParticipant,
  RemoteVideoTrack,
  RemoteAudioTrack,
  LocalAudioTrack,
  LocalVideoTrack,
} from "twilio-video";
import { BsMicMute } from "react-icons/bs";
import { TbScreenShare } from "react-icons/tb";

import usePublications from "../../../../../lib/hooks/usePublications";
import useTrack from "../../../../../lib/hooks/useTrack";
import useIsTrackSwitchedOff from "../../../../../lib/hooks/useIsTrackSwitchedOff";
//import useParticipantIsReconnecting from "../../../../../lib/hooks/useParticipantIsReconnecting";
import {
  VideoPreviewContainer,
  OverlayContent,
  InnerPreviewContainer,
  AvatarContainer,
} from "../../../../styled";
import useIsTrackEnabled from "../../../../../lib/hooks/useIsTrackEnabled";
import NetworkQualityLevel from "../NetworkQualityLevel/NetworkQualityLevel";
import EmojiReactionOverlay from "../EmojiReactionOverlay/EmojiReactionOverlay";

interface ParticipantInfoProps {
  participant: IParticipant;
  isLocalParticipant: boolean;
  isDominantSpeaker?: boolean;
  isMainFocus: boolean;
  children: React.ReactNode;
}

export default function ParticipantInfo({
  participant,
  isLocalParticipant,
  isDominantSpeaker,
  isMainFocus,
  children,
}: ParticipantInfoProps) {
  const { identity } = participant;
  const publications = usePublications(participant);
  const audioPublication = publications.find((p) => p.kind === "audio");
  const videoPublication = publications.find(
    (p) => !p.trackName.includes("screen") && p.kind === "video"
  );
  const emojiDataPublication = publications.find(
    (p) => p.kind === "data" && p.trackName === "emoji"
  );
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find((p) =>
    p.trackName.includes("screen")
  );
  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack
  );

  const audioTrack = useTrack(audioPublication) as
    | LocalAudioTrack
    | RemoteAudioTrack
    | undefined;
  const isAudioEnabled = useIsTrackEnabled(audioTrack);
  //const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const InfoContainer = styled.div(
    css({
      border: `3px solid ${
        isDominantSpeaker ? "rgb(4, 184, 52)" : "rgb(197, 199, 197)"
      }`,
      borderRadius: "10px",
      width: "100%",
      backgroundColor: "#000000",
    })
  );

  return (
    <InfoContainer id={participant.sid}>
      <VideoPreviewContainer>
        <EmojiReactionOverlay
          isLocalParticipant={isLocalParticipant}
          emojiPublication={emojiDataPublication}
        />
        <OverlayContent>
          <Stack orientation="horizontal" spacing="space10">
            {!!isScreenShareEnabled && (
              <TbScreenShare
                style={{
                  width: "14px",
                  height: "14px",
                  marginTop: "4px",
                  marginRight: "3px",
                }}
              />
            )}
            <NetworkQualityLevel participant={participant} />
            {!isAudioEnabled && (
              <BsMicMute
                style={{
                  width: "12px",
                  height: "12px",
                  color: "rgb(221, 39, 0)",
                }}
              />
            )}
            <Text
              as="p"
              color="colorText"
              fontSize={["fontSize10", "fontSize20", "fontSize30"]}
            >
              {isLocalParticipant ? `${identity} (you)` : identity}
            </Text>
          </Stack>
        </OverlayContent>
        <InnerPreviewContainer>
          {!isMainFocus && (!isVideoEnabled || isVideoSwitchedOff) && (
            <AvatarContainer>
              <Avatar size={["sizeIcon70", "sizeIcon110"]} name={identity} />
            </AvatarContainer>
          )}
          {children}
        </InnerPreviewContainer>
      </VideoPreviewContainer>
    </InfoContainer>
  );
}
