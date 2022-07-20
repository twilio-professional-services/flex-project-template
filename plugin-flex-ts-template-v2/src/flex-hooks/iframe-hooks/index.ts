import * as Flex from '@twilio/flex-ui';
import onClickToDial from "./onClickToDial";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  onClickToDial(flex, manager);
}