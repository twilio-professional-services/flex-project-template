import React from "react";
import * as Video from "twilio-video";
import { Box, Flex } from "@twilio-paste/core";

import Participant from "../Participant/Participant";
import ParticipantList from "../ParticipantList/ParticipantList";
import { FocusedTrackViewContainer } from "../../../styled";

interface OrderedParticipant {
  participant: Video.RemoteParticipant;
  dominantSpeakerStartTime: number;
}

interface FocusedTrackViewProps {
  orderedParticipants: OrderedParticipant[];
  dominantSpeaker: Video.RemoteParticipant | null;
  screenShareParticipant: any;
}

export default function FocusedTrackView({
  orderedParticipants,
  dominantSpeaker,
  screenShareParticipant,
}: FocusedTrackViewProps) {
  return (
    <FocusedTrackViewContainer>
      <Flex width={["100%"]} height="100%" vertical={[true, true, false]}>
        {/* Main Track Container */}
        <Box
          width={["100%", "100%", "80%"]}
          height={["80%", "80%", "100%"]}
          verticalAlign="center"
        >
          <Flex width={"100%"} height="100%" vAlignContent={"center"}>
            <Participant
              participant={screenShareParticipant}
              isLocalParticipant={false}
              isMainFocus
            />
          </Flex>
        </Box>
        {/* Participant List Container */}
        <Box width={["100%", "100%", "20%"]} height={["20%", "20%", "100%"]}>
          <ParticipantList
            orderedParticipants={orderedParticipants}
            dominantSpeaker={dominantSpeaker}
          />
        </Box>
      </Flex>
    </FocusedTrackViewContainer>
  );
}
