import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  useToaster,
  Toaster,
  Card,
  Text,
  Heading,
  Stack,
} from "@twilio-paste/core";

import { useVideoStore, VideoAppState } from "../../../../store/store";
import { MaxWidthDiv } from "../../../styled";
import { TEXT_COPY } from "../../../../lib/constants";

interface PermissionCheckProps {}

export default function PermissionCheck({}: PermissionCheckProps) {
  const toaster = useToaster();
  const { setHasSkippedPermissionCheck, setDevicePermissions } = useVideoStore(
    (state: VideoAppState) => state
  );
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const { PERMISSIONS_CHECK_WARNING } = TEXT_COPY;
  
  useEffect(() => {
    // automatically request permissions
    requestPermissions();
  }, []);

  const handleSkip = () => {
    setHasSkippedPermissionCheck(true);
  };

  async function requestPermissions() {
    setIsChecking(true);
    try {
      // get audio and video permissions then stop the tracks
      await navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(async (mediaStream) => {
          mediaStream.getTracks().forEach((track) => {
            track.stop();
          });
        });
      // The devicechange event is not fired after permissions are granted, so we fire it
      // ourselves to update the useDevices hook. The 500 ms delay is needed so that device labels are available
      // when the useDevices hook updates.
      setTimeout(
        () => navigator.mediaDevices.dispatchEvent(new Event("devicechange")),
        500
      );

      // At this point we know they have approved permissions
      setDevicePermissions("camera", true);
      setDevicePermissions("microphone", true);
      setHasSkippedPermissionCheck(true);
      setIsChecking(false);
    } catch (error: any) {
      // Permission denied or dismissed..
      toaster.push({
        message: `Error requesting permission to camera and mic: ${error.message}`,
        variant: "error",
      });
      setHasSkippedPermissionCheck(true);
      setIsChecking(false);
    }
  }

  return (
    <>
      <MaxWidthDiv>
        <Card>
          <Heading as="h4" variant="heading40">
            Browser Permissions Needed
          </Heading>
          <Text
            as="p"
            fontSize="fontSize20"
            fontWeight="fontWeightMedium"
            color="colorText"
          >
            {PERMISSIONS_CHECK_WARNING}
          </Text>
          <Flex marginTop={"space60"} grow hAlignContent={"center"}>
            <Stack orientation={"horizontal"} spacing="space30">
              <Button
                variant="primary"
                onClick={requestPermissions}
                loading={isChecking}
              >
                Understood
              </Button>
              <Button variant="secondary" onClick={handleSkip}>
                Skip
              </Button>
            </Stack>
          </Flex>
        </Card>
      </MaxWidthDiv>
      <Toaster {...toaster} />
    </>
  );
}
