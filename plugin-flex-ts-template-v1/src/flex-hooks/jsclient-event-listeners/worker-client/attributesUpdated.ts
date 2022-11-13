import * as Flex from '@twilio/flex-ui';
import { Worker } from '../../../types/task-router';


export default (flex: typeof Flex, manager: Flex.Manager) => {
  // (manager.workerClient as any).on('attributesUpdated', (worker: Worker) => {
  //   exampleFunction(worker);
  // });
}

function exampleFunction(worker: Worker) {
}
