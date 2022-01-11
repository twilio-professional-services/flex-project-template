import * as Flex from '@twilio/flex-ui';
import activityUpdated from './activityUpdated';
import attributesUpdated from './attributesUpdated';
import reservationCreated from './reservationCreated';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  activityUpdated(flex, manager);
  attributesUpdated(flex, manager);
  reservationCreated(flex, manager);
}