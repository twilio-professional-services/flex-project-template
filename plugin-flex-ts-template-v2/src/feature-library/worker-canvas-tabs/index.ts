import { FeatureDefinition } from '../../types/feature-loader';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  return { name: 'worker-canvas-tabs', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
