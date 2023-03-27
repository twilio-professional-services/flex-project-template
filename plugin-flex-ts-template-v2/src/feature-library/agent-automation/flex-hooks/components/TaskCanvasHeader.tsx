import * as Flex from '@twilio/flex-ui';

import AutoWrap from '../../custom-components/AutoComplete';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addAutoWrap(flex: typeof Flex) {
  flex.TaskCanvasHeader.Content.add(<AutoWrap key="auto-wrap" />, {
    sortOrder: -1,
    if: (props) => props.task.status === 'wrapping',
  });
};
