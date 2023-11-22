import * as Flex from '@twilio/flex-ui';

import logger from '../../../utils/logger';
import { FEATURE_NAME } from '..';

export const fetchWorkers = async (expression: string) => {
  logger.debug(`${FEATURE_NAME}: fetchWorkers utility called with expression: ${expression}`);
  return Flex.Manager.getInstance().workspaceClient?.fetchWorkers({
    TargetWorkersExpression: expression,
  });
};
