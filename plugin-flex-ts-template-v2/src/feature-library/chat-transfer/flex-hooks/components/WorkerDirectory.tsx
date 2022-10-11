import * as Flex from '@twilio/flex-ui';
import { isFeatureEnabled } from '../../index'
import WorkerDirectoryCustomization from '../../custom-components/WorkerDirectoryCustomization/'

export function addChatTransferCustomization(flex: typeof Flex) {
    if (!isFeatureEnabled()) return;

    flex.WorkerDirectory.Content.add(<WorkerDirectoryCustomization key="WorkerDirectoryCustomization" />)
}
