import { MediaObject, MediaBody, Text } from "@twilio-paste/core";
import React from "react";
import { RoomInfoDiv } from "../../../styled";

interface RoomInfoProps {
  roomName: string | undefined;
  numParticipants: number;
}

export default function RoomInfo({ roomName, numParticipants }: RoomInfoProps) {
  return (
    <RoomInfoDiv>
      <MediaObject as="div" verticalAlign="center">
        <MediaBody as="div">
          <Text as="p" fontSize="fontSize30" fontWeight="fontWeightMedium">
            {roomName}
          </Text>
          <Text as="p" fontSize="fontSize20">
            {numParticipants} participant{numParticipants > 1 && "s"}
          </Text>
        </MediaBody>
      </MediaObject>
    </RoomInfoDiv>
  );
}
