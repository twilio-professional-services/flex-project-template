import { useEffect, useState } from "react";
import { LocalTrackPublication, RemoteTrackPublication } from "twilio-video";

export default function useRemoteEmojiDataTrack(
  publication: LocalTrackPublication | RemoteTrackPublication | undefined
) {
  const [track, setTrack] = useState(publication && publication.track);
  const [remoteEmoji, setRemoteEmoji] = useState("");

  const setTemporaryEmoji = (msg: string) => {
    setRemoteEmoji(msg);
    setTimeout(() => {
      setRemoteEmoji("");
    }, 10000);
  };

  useEffect(() => {
    // Reset the track when the 'publication' variable changes.
    setTrack(publication && publication.track);
    if (publication) {
      const removeTrack = () => setTrack(null);
      console.log(track);
      const dataTrackSubscribed = (track: any) => {
        setTrack(track);
        track.on("message", function (msg: string) {
          console.log(msg);
          setTemporaryEmoji(msg);
        });
      };

      publication.on("subscribed", dataTrackSubscribed);
      publication.on("unsubscribed", removeTrack);
      return () => {
        publication.off("subscribed", dataTrackSubscribed);
        publication.off("unsubscribed", removeTrack);
      };
    }
  }, [publication]);

  return remoteEmoji;
}
