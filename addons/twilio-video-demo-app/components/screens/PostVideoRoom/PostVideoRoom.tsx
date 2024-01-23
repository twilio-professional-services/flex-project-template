import React from "react";
import {
  Flex,
  Card,
  Heading,
  Text,
  Button,
  Callout,
  CalloutHeading,
  CalloutText,
  Separator,
} from "@twilio-paste/core";

import { useVideoStore, VideoAppState } from "../../../store/store";
import { CenterContent, MaxWidthDiv } from "../../styled";
import { disconnectErrors } from "../../../lib/utils/errorDictionary";
import SurveyCollection from "./SurveyCollection/SurveyCollection";
import { TEXT_COPY } from "../../../lib/constants";

export default function PostVideoRoom({}) {
  const { DISCONNECT_ERROR_HEADER, DISCONNECT_HEADER } = TEXT_COPY;
  const { resetState, disconnectError } = useVideoStore(
    (state: VideoAppState) => state
  );

  const errorCode = disconnectError?.code;
  const errorInfo = !!errorCode ? disconnectErrors[errorCode] : null;

  return (
    <CenterContent>
      <Flex
        hAlignContent={"center"}
        vertical
        vAlignContent={"center"}
        height="100%"
      >
        {errorCode && (
          <MaxWidthDiv>
            <Card>
              <Heading as="h4" variant="heading40">
                Disconnection Error - {errorCode}
              </Heading>
              <Callout variant="error" marginY={"space40"}>
                <CalloutHeading as="h3">
                  {DISCONNECT_ERROR_HEADER}
                </CalloutHeading>
                <CalloutText>{errorInfo?.cause}</CalloutText>
              </Callout>
              <Text
                as="p"
                fontSize="fontSize20"
                fontWeight="fontWeightMedium"
                color="colorText"
              >
                {errorInfo?.solution}.
              </Text>
            </Card>
          </MaxWidthDiv>
        )}
        <MaxWidthDiv>
          <Card>
            {process.env.NEXT_PUBLIC_SURVEY_ENDPOINT ? (
                <>
                  <SurveyCollection />
                  <Separator orientation="horizontal" verticalSpacing="space50" />
                </>
              ) : (
                <Heading as="h4" variant="heading40">
                  {DISCONNECT_HEADER}
                </Heading>
              )}
            <Flex marginTop={"space60"} hAlignContent="center">
              <Button
                type="submit"
                variant="destructive"
                onClick={() => resetState()}
              >
                Rejoin video room
              </Button>
            </Flex>
          </Card>
        </MaxWidthDiv>
      </Flex>
    </CenterContent>
  );
}
