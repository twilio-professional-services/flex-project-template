import React, { useState, useEffect } from "react";
import {
  MenuItem,
  MediaBody,
  MediaFigure,
  MediaObject,
  MenuItemProps,
  Modal,
  ModalBody,
  ModalHeader,
  ModalHeading,
} from "@twilio-paste/core";
import { useUID } from "@twilio-paste/core/uid-library";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import { FiThumbsUp } from "react-icons/fi";

import { useVideoStore, VideoAppState } from "../../../../../store/store";

interface EmojiReactionsProps {
  menu: MenuItemProps;
  closeMenu: () => void;
}

export default function EmojiReactions({ menu }: EmojiReactionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const modalHeadingID = useUID();
  const { localTracks, setLocalEmoji, localEmoji } = useVideoStore(
    (state: VideoAppState) => state
  );

  const onEmojiPicked = (emojiData: EmojiClickData) => {
    localTracks?.data?.send(emojiData.emoji);
    setLocalEmoji(emojiData.emoji);
    handleClose();
  };

  useEffect(() => {
    if (localEmoji) {
      const timer = setTimeout(() => {
        setLocalEmoji("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [localEmoji]);

  return (
    <>
      <MenuItem
        {...menu}
        onClick={() => {
          handleOpen();
        }}
      >
        <MediaObject verticalAlign="center">
          <MediaBody>Emoji Reactions</MediaBody>
          <MediaFigure spacing="space20">
            <FiThumbsUp style={{ width: "12px", height: "12px" }} />
          </MediaFigure>
        </MediaObject>
      </MenuItem>
      <Modal
        ariaLabelledby={modalHeadingID}
        isOpen={isOpen}
        onDismiss={handleClose}
        size="default"
      >
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            Choose an Emoji Reaction 😎
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <EmojiPicker
            width={"100%"}
            onEmojiClick={(emoji: EmojiClickData) => onEmojiPicked(emoji)}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
