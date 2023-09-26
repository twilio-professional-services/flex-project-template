import React from "react";
import { Flex, Text } from "@twilio-paste/core";
import { MdErrorOutline } from "react-icons/md";
import { AiOutlineStop } from "react-icons/ai";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

import { useVideoStore, VideoAppState } from "../../../../store/store";

interface PermissionsWarningProps {}

export default function PermissionsWarning({}: PermissionsWarningProps) {
  const { devicePermissions } = useVideoStore((state: VideoAppState) => state);

  return (
    <Flex hAlignContent={"center"} vAlignContent={"center"} vertical>
      <Flex
        hAlignContent={"center"}
        vAlignContent={"center"}
        marginBottom="space20"
      >
        <MdErrorOutline
          style={{
            width: "20px",
            height: "20px",
            color: "rgb(221, 39, 0)",
            marginRight: "5px",
          }}
        />
        <Text as="p" fontSize="fontSize20">
          We don't have all permissions needed:
        </Text>
      </Flex>
      <Flex hAlignContent={"center"} vAlignContent={"center"}>
        {devicePermissions.microphone ? (
          <IoShieldCheckmarkSharp
            style={{
              width: "20px",
              height: "20px",
              color: "rgb(72, 221, 0)",
              marginRight: "5px",
            }}
          />
        ) : (
          <AiOutlineStop
            style={{
              width: "20px",
              height: "20px",
              marginRight: "5px",
              color: "rgb(221, 39, 0)",
            }}
          />
        )}
        <Text as="p" fontSize="fontSize20">
          Microphone
        </Text>
      </Flex>
      <Flex hAlignContent={"center"} vAlignContent={"center"}>
        {devicePermissions.camera ? (
          <IoShieldCheckmarkSharp
            style={{
              width: "20px",
              height: "20px",
              color: "rgb(72, 221, 0)",
              marginRight: "5px",
            }}
          />
        ) : (
          <AiOutlineStop
            style={{
              width: "20px",
              height: "20px",
              marginRight: "5px",
              color: "rgb(221, 39, 0)",
            }}
          />
        )}
        <Text as="p" fontSize="fontSize20">
          Camera
        </Text>
      </Flex>
    </Flex>
  );
}
