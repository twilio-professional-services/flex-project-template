import * as Flex from '@twilio/flex-ui';

import LanguageSelector from '../../custom-components/LanguageSelector/LanguageSelector';
import { FlexComponent } from '../../../../types/feature-loader';
import { isMenuEnabled } from '../../config';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function addDeviceManagerToMainHeader(flex: typeof Flex) {
  if (!isMenuEnabled()) {
    return;
  }
  flex.MainHeader.Content.add(<LanguageSelector key="language-selector" />, {
    sortOrder: 0,
    align: 'end',
  });
};
