import React from "react";
import * as Video from "twilio-video";

import { useVideoStore, VideoAppState } from "../../../../store/store";
import { GridViewContainer } from "../../../styled";
import Participant from "../Participant/Participant";
import {
  GALLERY_VIEW_ASPECT_RATIO,
  GALLERY_VIEW_MARGIN,
} from "../../../../lib/constants";
import useGalleryViewLayout from "../../../../lib/hooks/useGalleryViewLayout";

interface OrderedParticipant {
  participant: Video.RemoteParticipant;
  dominantSpeakerStartTime: number;
}

interface GridViewProps {
  orderedParticipants: OrderedParticipant[];
  dominantSpeaker: Video.RemoteParticipant | null;
}

export default function GridView({
  orderedParticipants,
  dominantSpeaker,
}: GridViewProps) {
  const { room } = useVideoStore((state: VideoAppState) => state);
  const numParticipants =
    orderedParticipants.length > 0 ? orderedParticipants.length + 1 : 1;
  const { participantVideoWidth, containerRef } =
    useGalleryViewLayout(numParticipants);
  const participantWidth = `${participantVideoWidth}px`;
  const participantHeight = `${Math.floor(
    participantVideoWidth * GALLERY_VIEW_ASPECT_RATIO
  )}px`;

  return (
    <GridViewContainer ref={containerRef}>
      {orderedParticipants.length > 0 &&
        orderedParticipants.map((remoteParticipant: OrderedParticipant) => {
          const isDominant = !!dominantSpeaker
            ? dominantSpeaker.sid === remoteParticipant.participant.sid
            : false;
          return (
            <div
              key={remoteParticipant.participant.sid}
              style={{
                width: participantWidth,
                height: participantHeight,
                margin: GALLERY_VIEW_MARGIN,
              }}
            >
              <Participant
                participant={remoteParticipant.participant}
                isLocalParticipant={false}
                isDominantSpeaker={isDominant}
                isMainFocus={false}
              />
            </div>
          );
        })}
      <div
        key={room!.localParticipant.sid}
        style={{
          width: participantWidth,
          height: participantHeight,
          margin: GALLERY_VIEW_MARGIN,
        }}
      >
        <Participant
          participant={room!.localParticipant}
          isLocalParticipant
          isMainFocus={false}
        />
      </div>
    </GridViewContainer>
  );
}
