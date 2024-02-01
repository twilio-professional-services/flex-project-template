import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: 'queues-stats-metrics', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
