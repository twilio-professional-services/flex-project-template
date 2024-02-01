import React from "react";
import { Participant } from "twilio-video";

import usePublications from "../../../../lib/hooks/usePublications";
import Publication from "../Publication/Publication";

interface ParticipantTracksProps {
  participant: Participant;
  isLocal: boolean;
  isMainFocus: boolean;
}

export default function ParticipantTracks({
  participant,
  isMainFocus,
  isLocal,
}: ParticipantTracksProps) {
  const publications = usePublications(participant);
  let enableScreenShare = true;
  let filteredPublications;

  if (
    enableScreenShare &&
    isMainFocus &&
    publications.some((p) => p.trackName.includes("screen"))
  ) {
    // When displaying a screenshare track is allowed, and a screen share track exists,
    // remove all video tracks without the name 'screen'.
    filteredPublications = publications.filter((p) =>
      p.trackName.includes("screen")
    );
  } else {
    // Else, remove all screenshare tracks
    filteredPublications = publications.filter(
      (p) => !p.trackName.includes("screen")
    );
  }

  return (
    <>
      {filteredPublications.map((publication) => (
        <Publication
          key={publication.kind}
          publication={publication}
          participant={participant}
          isLocal={isLocal}
        />
      ))}
    </>
  );
}
