import { validateUiVersion } from '../../utils/configuration';
import logger from '../../utils/logger';
import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  if (!validateUiVersion('>= 2.8.0')) {
    logger.error('[multi-call] This feature requires Flex UI 2.8 or later and has been disabled.');
    return {};
  }
  return { name: 'multi-call', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
