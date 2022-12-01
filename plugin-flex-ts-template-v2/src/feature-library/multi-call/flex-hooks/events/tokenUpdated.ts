import * as Flex from "@twilio/flex-ui";
import { SSOTokenPayload } from "@twilio/flex-ui/src/core/TokenStorage";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { SecondDevice } from '../../helpers/MultiCallHelper';

import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.multi_call || {};

const tokenUpdatedHandler = (tokenPayload: SSOTokenPayload, flexEvent: FlexEvent) => {
  if (!enabled || !SecondDevice) return;

  if (SecondDevice?.state === 'destroyed') {
    return;
  }
  
  SecondDevice?.updateToken(tokenPayload.token);
  
  console.log('MultiCall: Token updated');
};

export default tokenUpdatedHandler;
