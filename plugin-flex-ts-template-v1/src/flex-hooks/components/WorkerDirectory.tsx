import * as Flex from '@twilio/flex-ui';
import { staffOnly } from '../../feature-library/override-queue-transfer-directory/flex-hooks/components/WorkerDirectory'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  staffOnly(flex, manager)
}

