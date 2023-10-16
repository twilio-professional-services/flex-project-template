import { FeatureDefinition } from '../../types/feature-loader';
import {
  isFeatureEnabled,
  isSupervisorCapacityEnabled,
  isAttributeViewerEnabled,
  isWorkerDetailsEnabled,
} from './config';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  if (!isSupervisorCapacityEnabled && !isAttributeViewerEnabled && !isWorkerDetailsEnabled()) return {};
  return { name: 'worker-canvas-tabs', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
