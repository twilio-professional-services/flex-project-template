import React from "react";
import {
  MenuItem,
  MediaBody,
  MediaFigure,
  MediaObject,
  MenuItemProps,
  useToaster,
  Toaster,
} from "@twilio-paste/core";
import { useRouter } from 'next/router';

import { FiLink } from "react-icons/fi";

import { useVideoStore, VideoAppState } from "../../../../../store/store";

interface CopyInviteLinkProps {
  menu: MenuItemProps;
  closeMenu: () => void;
}

export default function CopyInviteLink({
  menu,
  closeMenu,
}: CopyInviteLinkProps) {
  const router = useRouter();
  const toaster = useToaster();

  const { formData } = useVideoStore((state: VideoAppState) => state);

  async function generateAndCopyRoomInvite() {
    try {
      const link = `${window.location.origin}${router.basePath}/index.html?roomName=${formData.roomName}`;
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(link);
      }
      toaster.push({
        message: `Invite link copied to clipboard!`,
        variant: "success",
        dismissAfter: 3000,
      });
    } catch (e) {
      console.log("error", e);
      toaster.push({
        message: `Error copying invite link`,
        variant: "error",
      });
    }
    closeMenu();
  }

  return (
    <>
      <MenuItem
        {...menu}
        onClick={() => {
          generateAndCopyRoomInvite();
        }}
      >
        <MediaObject verticalAlign="center">
          <MediaBody>Copy Invite Link</MediaBody>
          <MediaFigure spacing="space20">
            <FiLink style={{ width: "12px", height: "12px" }} />
          </MediaFigure>
        </MediaObject>
      </MenuItem>
      <Toaster {...toaster} />
    </>
  );
}
