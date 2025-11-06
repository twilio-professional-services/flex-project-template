import React, { useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Label,
  TextArea,
} from "@twilio-paste/core";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { useVideoStore, VideoAppState } from "../../../../store/store";
import {
  ROOM_ISSUES_FEEDBACK_OPTIONS,
  TEXT_COPY,
} from "../../../../lib/constants";
import { shipSurveyFeedback } from "../../../../lib/api";

export default function SurveyCollection({}) {
  const { SURVEY_COLLECTION_HEADER, SURVEY_COLLECTION_DESCRIPTION } = TEXT_COPY;
  const { room, formData, clearActiveRoom } = useVideoStore(
    (state: VideoAppState) => state
  );
  const [thumb, setThumb] = useState<"up" | "down" | null>(null);
  const [issuesFaced, setIssuesFaced] = useState<String[]>([]);
  const [otherIssues, setOtherIssues] = useState<String>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const ThankYouText = () => (
    <Flex width="100%" hAlignContent={"center"} marginTop="space60">
      <Text
        as="p"
        fontSize="fontSize30"
        fontWeight="fontWeightMedium"
        color="colorTextIconSuccess"
      >
        Thanks for your response!
      </Text>
    </Flex>
  );

  async function submitSurveyResponse() {
    console.log("----- submitting survey response -----");
    const surveyPayload = {
      roomSid: room?.sid,
      roomName: formData.roomName,
      participantSid: room?.localParticipant.sid,
      participantIdentity: formData.identity,
      thumbsUpOrDown: thumb ?? "up",
      issuesFaced,
      otherIssues,
    };

    console.log("payload to submit to data warehouse: ", surveyPayload);

    await shipSurveyFeedback(surveyPayload);

    setHasSubmitted(true);
    clearActiveRoom();
  }

  return (
    <Flex vertical vAlignContent={"center"} width="100%">
      <Heading as="h4" variant="heading40">
        {SURVEY_COLLECTION_HEADER}
      </Heading>
      <Text
        as="p"
        fontSize="fontSize20"
        fontWeight="fontWeightMedium"
        color="colorText"
      >
        {SURVEY_COLLECTION_DESCRIPTION}
      </Text>
      <Flex
        vertical
        width={"100%"}
        hAlignContent="center"
        marginTop="space60"
        marginBottom="space30"
      >
        <Text
          as="p"
          fontSize="fontSize30"
          fontWeight="fontWeightBold"
          color="colorTextIconOffline"
          marginBottom={"space30"}
        >
          How was the video & audio quality?
        </Text>
        <ButtonGroup attached>
          <Button
            variant={thumb === "up" ? "primary" : "secondary"}
            disabled={!!thumb}
            onClick={async () => {
              setThumb("up");
              await submitSurveyResponse();
            }}
          >
            <Flex width="100%" minWidth="100px" hAlignContent={"center"}>
              <FaRegThumbsUp style={{ width: "25px", height: "25px" }} />
            </Flex>
          </Button>
          <Button
            variant={thumb === "down" ? "destructive" : "secondary"}
            disabled={!!thumb}
            onClick={() => setThumb("down")}
          >
            <Flex width="100%" minWidth="100px" hAlignContent={"center"}>
              <FaRegThumbsDown style={{ width: "25px", height: "25px" }} />
            </Flex>
          </Button>
        </ButtonGroup>
        {thumb === "down" && (
          <Flex
            width="100%"
            hAlignContent={"center"}
            marginTop="space60"
            vertical
          >
            <Text
              as="p"
              fontSize="fontSize30"
              fontWeight="fontWeightBold"
              color="colorTextIconOffline"
              marginBottom={"space30"}
            >
              What went wrong?
            </Text>
            <Flex
              width="100%"
              wrap
              hAlignContent={"center"}
              marginBottom="space30"
            >
              {ROOM_ISSUES_FEEDBACK_OPTIONS.map((issue, index) => (
                <Flex marginRight="space30" marginBottom="space30" key={index}>
                  <Button
                    variant={
                      issuesFaced.indexOf(issue) !== -1
                        ? "destructive"
                        : "secondary"
                    }
                    disabled={hasSubmitted}
                    onClick={() => {
                      // Check if value already exists
                      if (issuesFaced.indexOf(issue) !== -1) {
                        // remove the issue from the array
                        setIssuesFaced((prevIssues) =>
                          prevIssues.filter((i) => i !== issue)
                        );
                      } else {
                        // add the value to the array
                        setIssuesFaced((prevIssues) => [...prevIssues, issue]);
                      }
                    }}
                  >
                    {issue}
                  </Button>
                </Flex>
              ))}
            </Flex>
            {issuesFaced.indexOf("Other issue") !== -1 && (
              <Flex
                vertical
                minWidth={"250px"}
                marginTop="space30"
                marginBottom="space30"
              >
                <Label htmlFor="other">Summary</Label>
                <TextArea
                  onChange={(e) => setOtherIssues(e.target.value)}
                  placeholder="Please describe the other issues faced"
                  disabled={hasSubmitted}
                />
              </Flex>
            )}
            <Button
              type="submit"
              variant="primary"
              onClick={async () => await submitSurveyResponse()}
              disabled={hasSubmitted}
            >
              {hasSubmitted ? "Thanks for your feedback!" : "Submit feedback"}
            </Button>
          </Flex>
        )}
        {hasSubmitted && <ThankYouText />}
      </Flex>
    </Flex>
  );
}
