import * as Flex from '@twilio/flex-ui';
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.internal_call || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;
  
  console.log(`Feature enabled: internal_call`);
};

export default pluginsLoadedHandler;
