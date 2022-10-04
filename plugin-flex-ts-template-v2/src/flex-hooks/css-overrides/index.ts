import * as Flex from "@twilio/flex-ui";
import css_overrides from "./css-overrides";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  css_overrides.forEach((css_override) => css_override());
};
