import * as Flex from '@twilio/flex-ui';
import { replaceUserControls } from '../../feature-library/activity-skill-filter/flex-hooks/components/MainHeader'
import { addPendingActivityComponent} from "../../feature-library/activity-reservation-handler/flex-hooks/components/MainHeader"

export default (flex: typeof Flex, manager: Flex.Manager) => {
  replaceUserControls(flex, manager);
  addPendingActivityComponent(flex, manager)
}