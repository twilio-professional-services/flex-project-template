import * as Flex from '@twilio/flex-ui';

import PauseStatusPanel from '../../custom-components/PauseStatusPanel';
import { isPermanentIndicatorEnabled } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.CallCanvas;
export const componentHook = function addPauseStatusPanel(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isPermanentIndicatorEnabled()) return;

  flex.CallCanvas.Content.add(<PauseStatusPanel key="pause-status-panel" />, {
    sortOrder: -1,
  });
};
