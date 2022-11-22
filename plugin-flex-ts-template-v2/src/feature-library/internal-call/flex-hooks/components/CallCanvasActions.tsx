import * as Flex from '@twilio/flex-ui';
import { isFeatureEnabled } from '../..';

export function removeDirectoryFromInternalCalls(flex: typeof Flex) {

  if(!isFeatureEnabled()) return;
  
  const isInternalCall = (props: any) => props.task.attributes.client_call === true;
  flex.CallCanvasActions.Content.remove("directory", { if: isInternalCall });
}
