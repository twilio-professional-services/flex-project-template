import React from "react";
import { styled, css } from "@twilio-paste/styling-library";
import { Text } from "@twilio-paste/text";
import { Flex } from "@twilio-paste/core/flex";
import { Card } from "@twilio-paste/core/card";
import { Heading } from "@twilio-paste/core/heading";
import { MediaObject, MediaFigure, MediaBody } from "@twilio-paste/core";

const CenterContent = styled.div(
  css({
    paddingX: "space40",
    paddingTop: "space200",
    paddingBottom: "space60",
    width: "100%",
    minHeight: "100vh",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "colorBackground",
    alignItems: "center",
    alignContent: "center",
    horizontalAlign: "center",
  })
);

const MaxWidthDiv = styled.div(
  css({
    maxWidth: "500px",
    marginTop: "space40",
  })
);

export default function PostVideoRoom() {
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
              Post Video Room
            </Text>
          </MediaBody>
        </MediaObject>
        <MaxWidthDiv>
          <Card>
            <Heading as="h4" variant="heading40">
              You video call has completed.
            </Heading>
            <Text
              as="p"
              fontSize="fontSize20"
              fontWeight="fontWeightMedium"
              color="colorText"
            >
              This view can be used to collect post video call CSAT or other
              data capture.
            </Text>
          </Card>
        </MaxWidthDiv>
      </Flex>
    </CenterContent>
  );
}
