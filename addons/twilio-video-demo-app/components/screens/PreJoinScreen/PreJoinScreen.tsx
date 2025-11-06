import React, { useEffect, useState } from "react";
import { Flex } from "@twilio-paste/core";

import { useVideoStore, VideoAppState } from "../../../store/store";
import { CenterContent } from "../../styled";
import PermissionCheck from "./PermissionCheck/PermissionCheck";
import DevicesPreset from "./DevicesPreset/DevicesPreset";

export default function PreJoinScreen() {
  const { devicePermissions, hasSkippedPermissionCheck } =
    useVideoStore((state: VideoAppState) => state);
  const [showPerms, setShowPerms] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const isPermissionGranted =
      devicePermissions.camera && devicePermissions.microphone ? true : false;
    if (hasSkippedPermissionCheck) {
      setShowPerms(false);
      setIsLoading(false);
    } else {
      setShowPerms(!isPermissionGranted);
      setIsLoading(false);
    }
  }, [
    devicePermissions.camera,
    devicePermissions.microphone,
    hasSkippedPermissionCheck,
  ]);

  return (
    <CenterContent>
      <Flex
        hAlignContent={"center"}
        vertical
        vAlignContent={"center"}
        height="100%"
      >
        {!isLoading && (
          <>{showPerms ? <PermissionCheck /> : <DevicesPreset />}</>
        )}
      </Flex>
    </CenterContent>
  );
}
