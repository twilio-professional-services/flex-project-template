import { isFeatureEnabled } from './config';
import { FeatureDefinition } from '../../types/feature-loader';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: 'mass-worker-update', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
