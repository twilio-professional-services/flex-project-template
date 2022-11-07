import * as Flex from '@twilio/flex-ui';

import ScheduleManagerStrings from './ScheduleManager';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    ...ScheduleManagerStrings,
    ...manager.strings,
  }
}
