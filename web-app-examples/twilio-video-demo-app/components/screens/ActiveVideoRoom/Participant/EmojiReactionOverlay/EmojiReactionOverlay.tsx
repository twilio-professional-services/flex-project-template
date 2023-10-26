import { RemoteTrackPublication, LocalTrackPublication } from "twilio-video";
import useRemoteEmojiDataTrack from "../../../../../lib/hooks/useRemoteEmojiDataTrack";
import { useVideoStore, VideoAppState } from "../../../../../store/store";

import { OverlayEmoji } from "../../../../styled";

interface EmojiReactionOverlayProps {
  isLocalParticipant: boolean;
  emojiPublication: LocalTrackPublication | RemoteTrackPublication | undefined;
}

export default function EmojiReactionOverlay({
  isLocalParticipant,
  emojiPublication,
}: EmojiReactionOverlayProps) {
  const { localEmoji } = isLocalParticipant ? useVideoStore((state: VideoAppState) => state) : { localEmoji: null };
  const remoteEmoji = !isLocalParticipant
    ? useRemoteEmojiDataTrack(emojiPublication)
    : null;

  return (
    <OverlayEmoji>
      {isLocalParticipant && localEmoji ? (
        <>{localEmoji}</>
      ) : (
        <>{remoteEmoji && <>{remoteEmoji}</>}</>
      )}
    </OverlayEmoji>
  );
}
