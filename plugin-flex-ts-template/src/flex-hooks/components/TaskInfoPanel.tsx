import * as Flex from '@twilio/flex-ui';
import { replaceViewForCallbacks } from '../../feature-library/callbacks/flex-hooks/components/TaskInfoPanel'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  replaceViewForCallbacks(flex, manager);
}

