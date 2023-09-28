import Console from '../../destination/Console';
import { getLogLevel } from '../../config';

export const loggerHook = () => {
  return new Console({ minLogLevel: getLogLevel() });
};
