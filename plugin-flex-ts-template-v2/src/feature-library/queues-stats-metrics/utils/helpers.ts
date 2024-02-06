import * as Flex from '@twilio/flex-ui';

export const isColumnDescriptionSupported = (): boolean => {
  const version = parseFloat(Flex.VERSION);
  return version >= 2.3;
};
