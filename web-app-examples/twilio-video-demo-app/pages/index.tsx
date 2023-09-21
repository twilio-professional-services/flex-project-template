import Head from "next/head";

import { Box } from "@twilio-paste/core/box";
import type { NextPage } from "next";
import VideoProvider from "../components/VideoProvider/VideoProvider";

const Home: NextPage = () => {
  return (
    <Box as="main">
      <Head>
        <title>Twilio Video</title>
      </Head>
      <VideoProvider />
    </Box>
  );
};

export default Home;
