import { validateUiVersion } from '../../../utils/configuration';

export const isColumnDescriptionSupported = (): boolean => {
  return validateUiVersion('>=2.3');
};
