import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Box } from "@twilio-paste/core/box";

import LandingPage from "../components/LandingPage/LandingPage";
import VideoRoom from "../components/VideoRoom/VideoRoom";

const Home: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  console.log("code", code);

  return (
    <Box as="main">
      <Head>
        <title>Twilio Video Lite</title>
        <link
          rel="icon"
          href="https://hosted-assets-2838-dev.twil.io/twilio.png"
        />
      </Head>
      {!!code ? <VideoRoom /> : <LandingPage />}
    </Box>
  );
};

export default Home;
