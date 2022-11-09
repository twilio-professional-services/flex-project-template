import * as Flex from "@twilio/flex-ui";
import { SSOTokenPayload } from "@twilio/flex-ui/src/core/TokenStorage";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { SecondDevice } from '../../helpers/MultiCallHelper';

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.multi_call || {};

const tokenUpdatedHandler = (tokenPayload: SSOTokenPayload, flexEvent: FlexEvent) => {
  if (!enabled || !SecondDevice) return;

  if (SecondDevice?.state === 'destroyed') {
    return;
  }
  
  SecondDevice?.updateToken(tokenPayload.token);
  
  console.log('MultiCall: Token updated');
};

export default tokenUpdatedHandler;
