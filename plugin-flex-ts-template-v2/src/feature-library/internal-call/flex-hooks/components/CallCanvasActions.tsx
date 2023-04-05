import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.CallCanvasActions;
export const componentHook = function removeDirectoryFromInternalCalls(flex: typeof Flex) {
  const isInternalCall = (props: any) => props.task.attributes.client_call === true;
  flex.CallCanvasActions.Content.remove('directory', { if: isInternalCall });
};
