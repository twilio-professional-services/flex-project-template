import * as Flex from '@twilio/flex-ui';
import ChatTransferButtonComponent, { Props } from './ChatTransferButtonComponent';


export default Flex.withTaskContext<Props, typeof ChatTransferButtonComponent>(Flex.withTheme(ChatTransferButtonComponent));;