import * as Flex from '@twilio/flex-ui';

import InlineMedia from '../../custom-components/InlineMedia';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MessageBubble;
export const componentHook = function addMyComponentToCallCanvas(flex: typeof Flex) {
  (flex.MessageBubble.Content as any).add(<InlineMedia key="inline-media-component" />, {
    sortOrder: 0,
    if: (props: any) => props.message.source.type === 'media',
  });
};
