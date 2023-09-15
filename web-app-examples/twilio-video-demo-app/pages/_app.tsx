import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Theme } from "@twilio-paste/core/theme";

const queryClient = new QueryClient();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme.Provider theme="default">
        <Component {...pageProps} />
      </Theme.Provider>
    </QueryClientProvider>
  );
};

export default MyApp;
