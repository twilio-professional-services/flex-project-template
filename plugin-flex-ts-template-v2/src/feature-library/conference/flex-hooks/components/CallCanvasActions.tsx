import * as Flex from '@twilio/flex-ui';

import ConferenceButton from '../../custom-components/ConferenceButton';
import { isAddButtonEnabled } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.CallCanvasActions;
export const componentHook = function addConferenceToCallCanvasActions(flex: typeof Flex) {
  if (!isAddButtonEnabled()) return;

  flex.CallCanvasActions.Content.add(<ConferenceButton key="conference" />, { sortOrder: 2 });
};
