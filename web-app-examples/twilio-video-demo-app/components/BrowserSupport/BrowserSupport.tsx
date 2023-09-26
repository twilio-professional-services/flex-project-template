import React, { useEffect, useState } from "react";
import Video from "twilio-video";
import { Flex, Card, Heading, Text } from "@twilio-paste/core";

import { CenterContent, MaxWidthDiv } from "../styled";

export default function BrowserSupport({
  children,
}: {
  children: React.ReactElement;
}) {
  const [videoSupported, setVideoSupported] = useState(true);

  useEffect(() => {
    if (!Video.isSupported) {
      setVideoSupported(false);
    }
  }, []);

  if (!videoSupported) {
    return (
      <CenterContent>
        <Flex
          hAlignContent={"center"}
          vertical
          vAlignContent={"center"}
          height="100%"
        >
          <MaxWidthDiv>
            <Card>
              <Heading as="h4" variant="heading40">
                Browser or context not supported
              </Heading>
              <Text
                as="p"
                fontSize="fontSize20"
                fontWeight="fontWeightMedium"
                color="colorText"
              >
                Please open this application in one of the{" "}
                <a
                  href="https://www.twilio.com/docs/video/javascript#supported-browsers"
                  target="_blank"
                  rel="noopener"
                >
                  supported browsers
                </a>
                .
                <br />
                <br />
                If you are using a supported browser, please ensure that this
                app is served over a{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts"
                  target="_blank"
                  rel="noopener"
                >
                  secure context
                </a>{" "}
                (e.g. https or localhost).
              </Text>
            </Card>
          </MaxWidthDiv>
        </Flex>
      </CenterContent>
    );
  }

  return children;
}
