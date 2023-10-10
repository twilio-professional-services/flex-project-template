import React from "react";
import {
  Button,
  Box,
  PopoverContainer,
  PopoverButton,
  Popover,
  Heading,
  Separator,
  Text,
} from "@twilio-paste/core";
import { CgClose } from "react-icons/cg";

import { useVideoStore, VideoAppState } from "../../../../../store/store";
import { TEXT_COPY } from "../../../../../lib/constants";

export default function LeaveRoom() {
  const { room } = useVideoStore((state: VideoAppState) => state);
  const {
    LEAVE_ROOM_CONFIRMATION_HEADER,
    LEAVE_ROOM_CONFIRMATION_DESCRIPTION,
  } = TEXT_COPY;

  function disconnect() {
    if (room) {
      room.disconnect();
    }
  }

  return (
    <PopoverContainer baseId="popover-right-example" placement="top">
      <PopoverButton variant="destructive" size="circle">
        <CgClose style={{ width: "25px", height: "25px" }} />
      </PopoverButton>
      <Popover aria-label="Popover">
        <Box width="size20">
          <Heading as="h3" variant="heading30">
            {LEAVE_ROOM_CONFIRMATION_HEADER}
          </Heading>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Text as="span">{LEAVE_ROOM_CONFIRMATION_DESCRIPTION}</Text>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Button onClick={disconnect} variant="destructive" fullWidth>
            Disconnect
          </Button>
        </Box>
      </Popover>
    </PopoverContainer>
  );
}
