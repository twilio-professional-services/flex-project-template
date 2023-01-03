import * as Flex from '@twilio/flex-ui';
import AutoWrap from '../../custom-components/AutoComplete';
import { isFeatureEnabled } from '../..';

export function addAutoWrap(flex: typeof Flex) {

  if(!isFeatureEnabled()) return;

  Flex.TaskCanvasHeader.Content.add(<AutoWrap key="auto-wrap" />,
  {
    sortOrder: -1,
    if: (props) => props.task.status === 'wrapping',
  });
}
