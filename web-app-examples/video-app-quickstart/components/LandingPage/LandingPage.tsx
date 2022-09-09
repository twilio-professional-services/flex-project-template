import React, { useState } from "react";
import { Text } from "@twilio-paste/text";
import { Flex } from "@twilio-paste/core/flex";
import { Card } from "@twilio-paste/core/card";
import { Heading } from "@twilio-paste/core/heading";
import {
  MediaObject,
  MediaFigure,
  MediaBody,
  HelpText,
  Input,
  Label,
  Button,
} from "@twilio-paste/core";
import { useRouter } from "next/router";
import { CenterContent, MaxWidthDiv } from "../../utils/styles";

export default function LandingPage() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    console.log(input);
    if (!!input) {
      router.push(`/?code=${input}`);
    }
  };

  return (
    <CenterContent>
      <Flex
        hAlignContent={"center"}
        vertical
        vAlignContent={"center"}
        height="100%"
      >
        <MediaObject as="div" verticalAlign="center" marginBottom={"space40"}>
          <MediaFigure as="div" spacing="space40">
            <img
              src="https://hosted-assets-2838-dev.twil.io/twilio.png"
              height="40px"
            />
          </MediaFigure>
          <MediaBody as="div">
            <Text as="p" fontSize="fontSize70" fontWeight="fontWeightMedium">
              Twilio Video Quickstart Lite
            </Text>
          </MediaBody>
        </MediaObject>
        <MaxWidthDiv>
          <Card>
            <Heading as="h4" variant="heading40">
              Welcome!
            </Heading>
            <Text
              as="p"
              fontSize="fontSize20"
              fontWeight="fontWeightMedium"
              color="colorText"
            >
              This quickstart application aims at getting you stood up rapidly
              with a React-powered web application, powered by{" "}
              <a
                href="https://www.twilio.com/docs/video/javascript"
                target="_blank"
                rel="noopener"
              >
                Twilio Video JS
              </a>
              .
            </Text>
            <Flex marginTop="space40" vertical>
              <Label htmlFor="video_room_name" required>
                Video Room Name
              </Label>
              <Input
                aria-describedby="email_help_text"
                id="video_room_name"
                name="video_room_name"
                placeholder="ex. 123456"
                type="text"
                required
                onChange={(e) => setInput(e.target.value)}
              />
              <HelpText id="email_help_text">
                To join a video room manually, please enter the room name.
              </HelpText>
              <Flex marginTop={"space40"}>
                <Button
                  type="submit"
                  variant="destructive"
                  onClick={handleSubmit}
                  style={{ background: "#F22F46" }}
                  disabled={!input}
                >
                  Next
                </Button>
              </Flex>
            </Flex>
          </Card>
        </MaxWidthDiv>
      </Flex>
    </CenterContent>
  );
}
