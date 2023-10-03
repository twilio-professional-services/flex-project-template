import Console from '../../destination/Console';
import { getLogLevel } from '../../config';

export const destinationName = 'Browser Console';
export const loggerHook = () => {
  // by default the Console logger should ignore meta data
  return new Console({ minLogLevel: getLogLevel(), metaData: null });
};
