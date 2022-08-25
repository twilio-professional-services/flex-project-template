import * as Flex from '@twilio/flex-ui';
import { addPendingActivityComponent} from "../../feature-library/activity-reservation-handler/flex-hooks/components/MainHeader"

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addPendingActivityComponent(flex, manager)
}