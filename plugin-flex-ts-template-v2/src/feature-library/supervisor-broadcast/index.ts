import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const FEATURE_NAME = 'supervisor-broadcast';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: FEATURE_NAME, hooks: typeof hooks === 'undefined' ? [] : hooks };
};
