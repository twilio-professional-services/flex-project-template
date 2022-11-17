import * as Flex from '@twilio/flex-ui';
import ConferenceButton from '../../custom-components/ConferenceButton';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes || {}
const { enabled = false, add_button = true } = custom_data?.features?.conference || {};

export function addConferenceToCallCanvasActions(flex: typeof Flex) {

  if(!enabled || !add_button) return;
  
  flex.CallCanvasActions.Content.add(<ConferenceButton
    key="conference"
  />, { sortOrder: 2 });
}
