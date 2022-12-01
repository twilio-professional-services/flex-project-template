import * as Flex from '@twilio/flex-ui';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.internal_call || {};

export function removeDirectoryFromInternalCalls(flex: typeof Flex) {

  if(!enabled) return;
  
  const isInternalCall = (props: any) => props.task.attributes.client_call === true;
  flex.CallCanvasActions.Content.remove("directory", { if: isInternalCall });
}
