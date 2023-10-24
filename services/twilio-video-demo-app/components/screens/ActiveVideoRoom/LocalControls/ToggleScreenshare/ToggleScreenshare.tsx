import React from "react";
import { Tooltip, Button, useToaster, Toaster } from "@twilio-paste/core";
import { TbScreenShare, TbScreenShareOff } from "react-icons/tb";
import { useVideoStore, VideoAppState } from "../../../../../store/store";
import useScreenShareParticipant from "../../../../../lib/hooks/useScreenShareParticipant";
import useScreenShareToggle from "../../../../../lib/hooks/useScreenShareToggle";

export default function ToggleScreenshare() {
  const toaster = useToaster();
  const { room } = useVideoStore((state: VideoAppState) => state);
  const screenShareParticipant = useScreenShareParticipant(room);
  const isScreenShareLocal =
    !!screenShareParticipant &&
    screenShareParticipant === room?.localParticipant;
  const [isSharing, toggleScreenShare] = useScreenShareToggle(room, () => {
    toaster.push({
      message: `Could not share screen - please try again.`,
      variant: "error",
    });
  });

  return (
    <>
      <Tooltip
        text={
          !!screenShareParticipant && !isScreenShareLocal
            ? "Someone else is sharing"
            : isSharing
            ? "Stop sharing"
            : "Share screen"
        }
        placement="top"
      >
        <Button
          variant={!isSharing ? "primary" : "destructive"}
          size="circle"
          onClick={toggleScreenShare}
          disabled={!!screenShareParticipant && !isScreenShareLocal}
        >
          {!isSharing ? (
            <TbScreenShare style={{ width: "25px", height: "25px" }} />
          ) : (
            <TbScreenShareOff style={{ width: "25px", height: "25px" }} />
          )}
        </Button>
      </Tooltip>
      <Toaster {...toaster} />
    </>
  );
}
