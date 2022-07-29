import * as Flex from '@twilio/flex-ui';
import { replaceUserControls } from '../../feature-library/activity-skill-filter/flex-hooks/components/MainHeader'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  replaceUserControls(flex, manager);
}