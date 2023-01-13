import * as Flex from "@twilio/flex-ui";
// @ts-ignore
import featureCssOverrides from "../../feature-library/*/flex-hooks/css-overrides/*";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (typeof featureCssOverrides !== 'undefined') {
    featureCssOverrides.forEach((file: any) => {
      file.default(flex, manager);
    });
  }
};
