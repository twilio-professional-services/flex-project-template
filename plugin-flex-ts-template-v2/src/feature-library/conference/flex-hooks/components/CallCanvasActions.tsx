import * as Flex from '@twilio/flex-ui';
import ConferenceButton from '../../custom-components/ConferenceButton';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false, add_button = true } = getFeatureFlags().features?.conference || {};

export function addConferenceToCallCanvasActions(flex: typeof Flex) {

  if(!enabled || !add_button) return;
  
  flex.CallCanvasActions.Content.add(<ConferenceButton
    key="conference"
  />, { sortOrder: 2 });
}
