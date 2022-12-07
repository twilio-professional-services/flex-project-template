import * as Flex from '@twilio/flex-ui';
import ConferenceButton from '../../custom-components/ConferenceButton';
import { isAddButtonEnabled } from '../..';

export function addConferenceToCallCanvasActions(flex: typeof Flex) {

  if(!isAddButtonEnabled()) return;
  
  flex.CallCanvasActions.Content.add(<ConferenceButton
    key="conference"
  />, { sortOrder: 2 });
}
