import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { getCustomLogoUrl } from '../../config';
import { replaceStringAttributes } from '../../../../utils/helpers';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function applyBrandingLogo(flex: typeof Flex) {
  if (Boolean(getCustomLogoUrl())) {
    flex.MainHeader.defaultProps.logoUrl = replaceStringAttributes(getCustomLogoUrl());
  }
};
