import * as Flex from '@twilio/flex-ui';

import AutoComplete from '../../custom-components/AutoComplete';
import WrapupCountdown from '../../custom-components/WrapupCountdown';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addAutoComplete(flex: typeof Flex) {
  flex.TaskCanvasHeader.Content.add(<AutoComplete key="auto-complete" />, {
    sortOrder: 1,
    if: (props) => props.task.status === 'wrapping',
  });

  flex.TaskCanvasHeader.Content.add(<WrapupCountdown key="wrapup-countdown" />, {
    sortOrder: -1,
    if: (props) => props.task.status === 'wrapping',
  });
  flex.TaskCanvasHeader.Content.remove('header', {
    if: (props) => props.task.status === 'wrapping',
  });
};
