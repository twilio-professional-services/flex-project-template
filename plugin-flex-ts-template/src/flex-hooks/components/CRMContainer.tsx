import * as Flex from '@twilio/flex-ui';
import { replaceAndSetCustomCRMContainer } from '../../feature-library/enhanced-crm-container/flex-hooks/components/CRMContainer'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  replaceAndSetCustomCRMContainer(flex, manager);
}
