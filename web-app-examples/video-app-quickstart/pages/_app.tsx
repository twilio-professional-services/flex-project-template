import type { AppProps, NextWebVitalsMetric } from "next/app";
import { CustomizationProvider } from "@twilio-paste/core/customization";

import CustomTheme from "../theme/theme.json";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <CustomizationProvider baseTheme="default" theme={CustomTheme}>
      <Component {...pageProps} />
    </CustomizationProvider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  console.log(metric);
}

export default MyApp;
