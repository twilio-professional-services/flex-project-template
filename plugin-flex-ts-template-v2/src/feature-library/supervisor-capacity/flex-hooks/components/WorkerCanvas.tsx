import * as Flex from '@twilio/flex-ui';
import { ContentFragmentProps } from '@twilio/flex-ui';

import CapacityContainer from '../../custom-components/CapacityContainer';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';

interface TabbedContentFragmentProps extends ContentFragmentProps {
  tabTitle: string;
}

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addCapacityToWorkerCanvas() {
  Flex.WorkerCanvas.Content.add(<CapacityContainer key="worker-capacity-container" />, {
    tabTitle: StringTemplates.Capacity,
  } as TabbedContentFragmentProps);
};
