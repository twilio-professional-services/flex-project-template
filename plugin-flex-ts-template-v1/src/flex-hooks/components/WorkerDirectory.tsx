import * as Flex from '@twilio/flex-ui';
import { replaceQueueTabForChatTransfers } from '../../feature-library/override-queue-transfer-directory/flex-hooks/components/WorkerDirectory'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  replaceQueueTabForChatTransfers(flex, manager);
}

