import { useEffect, useState } from "react";
import { LocalTrackPublication, RemoteTrackPublication } from "twilio-video";

export default function useRemoteEmojiDataTrack(
  publication: LocalTrackPublication | RemoteTrackPublication | undefined
) {
  const [remoteEmoji, setRemoteEmoji] = useState("");

  const setTemporaryEmoji = (msg: string) => {
    setRemoteEmoji(msg);
    setTimeout(() => {
      setRemoteEmoji("");
    }, 10000);
  };
  
  const handleMessage = (msg: string) => {
    console.log("Received data", msg);
    setTemporaryEmoji(msg);
  }
  
  const dataTrackSubscribed = (track: any) => {
    track.on("message", handleMessage);
  };
  
  useEffect(() => {
    return () => {
      publication?.off("subscribed", dataTrackSubscribed);
      publication?.track?.off("message", handleMessage);
    }
  }, []);

  useEffect(() => {
    // Reset the track when the 'publication' variable changes.
    if (publication) {
      if (publication.track) {
        // already subscribed
        publication.track.on("message", handleMessage);
      } else {
        publication.on("subscribed", dataTrackSubscribed);
      }

      return () => {
        publication.off("subscribed", dataTrackSubscribed);
      };
    }
  }, [publication]);

  return remoteEmoji;
}
