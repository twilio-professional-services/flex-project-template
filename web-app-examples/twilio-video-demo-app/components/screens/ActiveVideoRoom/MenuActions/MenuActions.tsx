import React from "react";
import { useMenuState, MenuButton, Menu } from "@twilio-paste/core";
import { FiMoreVertical } from "react-icons/fi";

import EmojiReactions from "./EmojiReactions/EmojiReactions";
import CopyInviteLink from "./CopyInviteLink/CopyInviteLink";

export default function MenuActions() {
  const menu = useMenuState();

  return (
    <>
      <MenuButton {...menu} variant="reset" size="reset">
        <FiMoreVertical
          style={{ width: "20px", height: "20px", marginTop: "5px" }}
        />
      </MenuButton>
      <Menu {...menu} aria-label="Preferences">
        <EmojiReactions menu={menu} closeMenu={() => menu.hide()} />
        <CopyInviteLink menu={menu} closeMenu={() => menu.hide()} />
      </Menu>
    </>
  );
}
