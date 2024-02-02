import * as Flex from '@twilio/flex-ui';

import logger from '../../../utils/logger';
import { FEATURE_NAME } from '..';

const fetchAll = async () => {
  return Flex.Manager.getInstance().workspaceClient?.fetchWorkers({
    TargetWorkersExpression: `1==1"`,
  });
};

const fetchByName = async (expression: string) => {
  return Flex.Manager.getInstance().workspaceClient?.fetchWorkers({
    TargetWorkersExpression: `full_name CONTAINS "${expression}"`,
  });
};

const fetchBySkill = async (expression: string) => {
  return Flex.Manager.getInstance().workspaceClient?.fetchWorkers({
    TargetWorkersExpression: `routing.skills HAS "${expression}"`,
  });
};

export const fetchWorkers = async (expression: string) => {
  logger.debug(`${FEATURE_NAME}: fetchWorkers utility called with expression: ${expression}`);
  let result: any = null;
  if (expression === 'all') {
    result = await fetchAll();
    return result;
  } else if (expression !== 'all') {
    // If 'all' fails or expression is not 'all' then get by name
    result = await fetchByName(expression);
    if (result.size > 0) {
      return result;
    }
    // If name fails then get by skills
    result = await fetchBySkill(expression);
    return result;
  }
  return result;
};
