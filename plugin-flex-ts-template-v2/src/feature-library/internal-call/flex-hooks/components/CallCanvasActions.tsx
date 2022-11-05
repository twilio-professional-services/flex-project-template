import * as Flex from '@twilio/flex-ui';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data?.features?.internal_call || {}

export function removeDirectoryFromInternalCalls(flex: typeof Flex) {

  if(!enabled) return;
  
  const isInternalCall = (props: any) => props.task.attributes.client_call === true;
  flex.CallCanvasActions.Content.remove("directory", { if: isInternalCall });
}
