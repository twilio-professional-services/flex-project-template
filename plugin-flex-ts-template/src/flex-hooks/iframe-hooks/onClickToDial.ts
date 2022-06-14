import * as Flex from '@twilio/flex-ui';
import { addSalesforceDataToOutboundCall } from '../../feature-library/salesforce-click-to-dial/flex-hooks/iframe-hooks/onClickToDial';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addSalesforceDataToOutboundCall(flex, manager)
}
