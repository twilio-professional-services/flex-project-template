import * as Flex from '@twilio/flex-ui';
import { ContentFragmentProps } from '@twilio/flex-ui';

import WorkerDetailsContainer from '../../custom-components/WorkerDetailsContainer/WorkerDetailsContainer';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings';

interface TabbedContentFragmentProps extends ContentFragmentProps {
  tabTitle: string;
}

export const componentName = FlexComponent.WorkerCanvas;
export const componentHook = function addDetailsToWorkerCanvas() {
  Flex.WorkerCanvas.Content.add(<WorkerDetailsContainer key="worker-details-container" />, {
    tabTitle: StringTemplates.PSWorkerDetailsContainerName,
  } as TabbedContentFragmentProps);
};
