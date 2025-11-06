import * as Flex from '@twilio/flex-ui';
import { ContentFragmentProps } from '@twilio/flex-ui';

import WorkerAttributes from '../../custom-components/WorkerAttributes';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';

interface TabbedContentFragmentProps extends ContentFragmentProps {
  tabTitle: string;
}

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addAttributesToWorkerCanvas() {
  Flex.WorkerCanvas.Content.add(<WorkerAttributes key="worker-attributes" />, {
    tabTitle: StringTemplates.WorkerAttributesHeader,
    sortOrder: 1000,
  } as TabbedContentFragmentProps);
};
