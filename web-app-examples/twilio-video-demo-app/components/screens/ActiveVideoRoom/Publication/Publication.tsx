import React from "react";

import { IVideoTrack } from "../../../../lib/types";
import {
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
  Track,
} from "twilio-video";
import useTrack from "../../../../lib/hooks/useTrack";
import VideoElement from "../VideoElement/VideoElement";
import AudioElement from "../AudioElement/AudioElement";

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  videoPriority?: Track.Priority | null;
  isLocal: boolean;
}

export default function Publication({
  publication,
  videoPriority,
  isLocal,
}: PublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case "video":
      return (
        <VideoElement
          track={track as IVideoTrack}
          priority={videoPriority}
          isLocal={isLocal}
        />
      );
    case "audio":
      return <AudioElement track={track} />;
    default:
      return null;
  }
}
