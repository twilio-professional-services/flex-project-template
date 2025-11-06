import { isFeatureEnabled } from './config';
import { FeatureDefinition } from '../../types/feature-loader';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: 'supervisor-capacity', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
