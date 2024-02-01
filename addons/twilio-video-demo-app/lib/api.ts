import { useQuery } from "react-query";
import axios from "axios";

const BACKEND_URL = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")) ? `http://${process.env.NEXT_PUBLIC_SERVERLESS_FUNCTIONS_DOMAIN_LOCAL}` : `https://${process.env.NEXT_PUBLIC_SERVERLESS_FUNCTIONS_DOMAIN}`;

export const getAccessToken = async (
  roomName: string | undefined,
  identity?: string | undefined
) => {
  const { data } = await axios.get(
    `${BACKEND_URL}/features/chat-to-video-escalation/common/client-get-token?roomName=${roomName}&identity=${identity}`
  );
  return data;
};

export const shipRoomStats = async (roomStats: any) => {
  if (!process.env.NEXT_PUBLIC_LOGGING_ENDPOINT) return;
  await axios
    .post(`${process.env.NEXT_PUBLIC_LOGGING_ENDPOINT}`, { data: roomStats })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const shipSurveyFeedback = async (feedback: any) => {
  if (!process.env.NEXT_PUBLIC_SURVEY_ENDPOINT) return;
  await axios
    .post(`${process.env.NEXT_PUBLIC_SURVEY_ENDPOINT}`, feedback)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const useGetToken = (
  roomName: string | undefined,
  identity?: string | undefined
) => {
  return useQuery(
    ["token", roomName, identity],
    async () => {
      const data = await getAccessToken(roomName, identity);
      return data;
    },
    {
      enabled: !roomName?.includes("undefined"),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
};
