import React from "react";
import Video from "twilio-video";
import { Stack } from "@twilio-paste/core/stack";
import { Flex } from "@twilio-paste/core/flex";
import { Card } from "@twilio-paste/core/card";
import { Heading } from "@twilio-paste/core/heading";

export default function UnsupportedBrowserWarning({
  children,
}: {
  children: React.ReactElement;
}) {
  if (!Video.isSupported) {
    return (
      <Stack orientation="vertical" spacing="space40">
        <Flex>
          <Card>
            <Heading as="h4" variant="heading40">
              Browser or context not supported
            </Heading>
            <Heading as="h5" variant="heading50">
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
              If you are using a supported browser, please ensure that this app
              is served over a{" "}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts"
                target="_blank"
                rel="noopener"
              >
                secure context
              </a>{" "}
              (e.g. https or localhost).
            </Heading>
          </Card>
        </Flex>
      </Stack>
    );
  }

  return children;
}
