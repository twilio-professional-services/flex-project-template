import React, { useRef, useEffect } from "react";
import { Track, LocalVideoTrack } from "twilio-video";
import { VideoContainer } from "../../../../styled";

interface VideoPreviewTrackProps {
  track: LocalVideoTrack;
  priority?: Track.Priority | null;
}

export default function VideoPreviewTrack({
  track,
  priority,
}: VideoPreviewTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    track.attach(el);

    return () => {
      track?.detach(el);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;
    };
  }, [track, priority]);

  const style = {
    objectFit: "cover" as const,
    transform: "scaleX(-1)",
  };

  return <VideoContainer ref={ref} style={style} />;
}
