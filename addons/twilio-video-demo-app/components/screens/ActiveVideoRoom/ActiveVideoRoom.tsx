import React, { useEffect, useState } from "react";
import { Flex, Stack, Text } from "@twilio-paste/core";
import * as Video from "twilio-video";

import { TEXT_COPY } from "../../../lib/constants";
import { UIStep, useVideoStore, VideoAppState } from "../../../store/store";
import { ActiveVideoRoomContainer, FooterDiv, WaitingOverlayContainer } from "../../styled";
import ConfigureSettings from "../../ConfigureSettings/ConfigureSettings";
import ToggleVideo from "./LocalControls/ToggleVideo/ToggleVideo";
import ToggleAudio from "./LocalControls/ToggleAudio/ToggleAudio";
import ToggleScreenshare from "./LocalControls/ToggleScreenshare/ToggleScreenshare";
import LeaveRoom from "./LocalControls/LeaveRoom/LeaveRoom";
import RoomInfo from "./RoomInfo/RoomInfo";
import { shipRoomStats } from "../../../lib/api";
import useScreenShareParticipant from "../../../lib/hooks/useScreenShareParticipant";
import GridView from "./GridView/GridView";
import FocusedTrackView from "./FocusedTrackView/FocusedTrackView";
import MenuActions from "./MenuActions/MenuActions";

interface OrderedParticipant {
  participant: Video.RemoteParticipant;
  dominantSpeakerStartTime: number;
}

export default function ActiveVideoRoom({}) {
  const { room, formData, setUIStep, localTracks, setDisconnectError } =
    useVideoStore((state: VideoAppState) => state);
  const [dominantSpeaker, setDominantSpeaker] =
    useState<Video.RemoteParticipant | null>(null);
  const [orderedParticipants, setOrderedParticipants] = useState<
    OrderedParticipant[]
  >(
    Array.from(room?.participants?.values() ?? [], (p) => ({
      participant: p,
      dominantSpeakerStartTime: 0,
    }))
  );
  const screenShareParticipant = useScreenShareParticipant(room);
  const { WAITING_FOR_PARTICIPANTS_HEADER } = TEXT_COPY;

  useEffect(() => {
    if (room) {
      const participantArray = Array.from(room.participants.values(), (p) => ({
        participant: p,
        dominantSpeakerStartTime: 0,
      }));
      setOrderedParticipants(participantArray);

      const handleParticipantConnected = (
        participant: Video.RemoteParticipant
      ) => {
        setOrderedParticipants((prevParticipants) => [
          ...prevParticipants,
          { participant, dominantSpeakerStartTime: 0 },
        ]);
      };

      const handleParticipantDisconnected = (
        participant: Video.RemoteParticipant
      ) => {
        setOrderedParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p.participant !== participant)
        );
      };

      const handleDominantSpeakerChanged = (
        participant: Video.RemoteParticipant
      ) => {
        if (participant) {
          setDominantSpeaker(participant);
        } else {
          setDominantSpeaker(null);
        }
      };

      room.on("participantConnected", handleParticipantConnected);
      room.on("participantDisconnected", handleParticipantDisconnected);
      room.on("dominantSpeakerChanged", handleDominantSpeakerChanged);
      room.once("disconnected", (error) => {
        localTracks.audio?.stop();
        localTracks.video?.stop();
        localTracks.screen?.stop();
        if (error) {
          setDisconnectError(error.code, error.message);
        }
        setUIStep(UIStep.VIDEO_ROOM_DISCONNECT);
      });

      return () => {
        room.off("participantConnected", handleParticipantConnected);
        room.off("participantDisconnected", handleParticipantDisconnected);
        room.off("dominantSpeakerChanged", handleDominantSpeakerChanged);
      };
    }
  }, [room]);

  //Ship WebRTC stats to data store
  useEffect(() => {
    const shipStats = setInterval(async () => {
      room
        ?.getStats()
        .then((results) => shipRoomStats(results[0]))
        .catch((error) => console.log("error gathering WebRTC stats", error));
    }, 15000);
    return () => clearInterval(shipStats);
  }, [room]);

  // Disconnect from the Video room if browser tab is refreshed or closed
  window.addEventListener("beforeunload", () => {
    room?.disconnect();
  });

  return (
    <ActiveVideoRoomContainer>
      {!orderedParticipants.length && (
        <WaitingOverlayContainer>
          <Text
            as="p"
            fontSize="fontSize60"
            fontWeight="fontWeightMedium"
            color="colorTextBrandInverse"
            textAlign="center"
            padding="space60"
          >
            {WAITING_FOR_PARTICIPANTS_HEADER}
          </Text>
        </WaitingOverlayContainer>
      )}
      {!!screenShareParticipant &&
      screenShareParticipant !== room?.localParticipant ? (
        <FocusedTrackView
          orderedParticipants={orderedParticipants}
          dominantSpeaker={dominantSpeaker}
          screenShareParticipant={screenShareParticipant}
        />
      ) : (
        <GridView
          orderedParticipants={orderedParticipants}
          dominantSpeaker={dominantSpeaker}
        />
      )}
      <FooterDiv>
        <Flex width="100%" height="100%" vAlignContent="center">
          <Flex>
            <RoomInfo
              roomName={formData.roomName}
              numParticipants={orderedParticipants.length + 1}
            />
          </Flex>
          <Flex grow hAlignContent={"center"}>
            <Stack orientation="horizontal" spacing="space70">
              <ToggleAudio />
              <ToggleVideo />
              <ToggleScreenshare />
              <ConfigureSettings />
              <MenuActions />
            </Stack>
          </Flex>
          <Flex>
            <Flex width="100%" hAlignContent={"right"} vAlignContent={"center"}>
              <LeaveRoom />
            </Flex>
          </Flex>
        </Flex>
      </FooterDiv>
    </ActiveVideoRoomContainer>
  );
}
