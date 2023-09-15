import Head from "next/head";

import { Box } from "@twilio-paste/core/box";
import type { NextPage } from "next";
import VideoProvider from "../components/VideoProvider/VideoProvider";

const Home: NextPage = () => {
  return (
    <Box as="main">
      <Head>
        <title>Twilio Video Demo App</title>
        <link
          rel="icon"
          href="https://hosted-assets-2838-dev.twil.io/twilio.png"
        />
      </Head>
      <VideoProvider />
    </Box>
  );
};

export default Home;
