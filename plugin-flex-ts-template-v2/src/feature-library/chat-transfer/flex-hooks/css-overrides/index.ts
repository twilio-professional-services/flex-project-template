import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from '../../index';

export default async () => {
  if (!isFeatureEnabled()) return;

  Flex.Manager.getInstance().updateConfig({
    theme: {
      componentThemeOverrides: {
        WorkerDirectory: {
          Container: {
            ".Twilio-WorkerDirectory-ButtonContainer": {
              "&>:nth-child(1)": {
                display: "none"
              }
            }
          }
        }
      },
    },
  });
};
