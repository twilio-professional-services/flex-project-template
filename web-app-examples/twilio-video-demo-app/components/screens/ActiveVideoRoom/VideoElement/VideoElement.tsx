import React, { useRef, useEffect } from "react";
import { IVideoTrack } from "../../../../lib/types";
import { Track } from "twilio-video";
import { VideoContainer } from "../../../styled";

interface VideoElementProps {
  track: IVideoTrack;
  priority?: Track.Priority | null;
  isLocal: boolean;
}

export default function VideoElement({
  track,
  priority,
  isLocal,
}: VideoElementProps) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;

      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  const style = {
    transform: isLocal ? "scaleX(-1)" : "",
    objectFit: "cover" as const,
  };

  return <VideoContainer ref={ref} style={style} />;
}
