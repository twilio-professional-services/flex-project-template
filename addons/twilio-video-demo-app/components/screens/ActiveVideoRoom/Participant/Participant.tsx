import React from "react";
import { Participant as IParticipant } from "twilio-video";

import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";
import ParticipantInfo from "./ParticipantInfo/ParticipantInfo";

interface RoomParticipantProps {
  participant: IParticipant;
  isLocalParticipant: boolean;
  isDominantSpeaker?: boolean;
  isMainFocus: boolean;
}

export default function Participant({
  participant,
  isLocalParticipant,
  isDominantSpeaker,
  isMainFocus,
}: RoomParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      isLocalParticipant={isLocalParticipant}
      isDominantSpeaker={isDominantSpeaker}
      isMainFocus={isMainFocus}
    >
      <ParticipantTracks
        isLocal={isLocalParticipant}
        participant={participant}
        isMainFocus={isMainFocus}
      />
    </ParticipantInfo>
  );
}
