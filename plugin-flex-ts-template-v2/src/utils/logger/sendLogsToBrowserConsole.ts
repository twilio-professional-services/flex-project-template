import Console from './Console';

export const loggerHook = function sendLogsToBrowserConsole() {
  return new Console({ minLogLevel: 'debug', metaData: null });
};
