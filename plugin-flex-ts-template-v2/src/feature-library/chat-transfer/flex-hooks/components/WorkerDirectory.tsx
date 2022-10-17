import * as Flex from '@twilio/flex-ui';
import { isColdTransferEnabled } from '../../index'
import WorkerDirectoryCustomization from '../../custom-components/WorkerDirectoryCustomization/'

export function addChatTransferCustomization(flex: typeof Flex) {
    if (!isColdTransferEnabled()) return;

    flex.WorkerDirectory.Content.add(<WorkerDirectoryCustomization key="WorkerDirectoryCustomization" />)
}
