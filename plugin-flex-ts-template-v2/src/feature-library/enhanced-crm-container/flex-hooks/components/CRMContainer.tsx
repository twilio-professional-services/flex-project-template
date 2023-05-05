import * as Flex from '@twilio/flex-ui';

import { displayUrlWhenNoTasks, shouldDisplayUrlWhenNoTasks } from '../../config';
import IFrameCRMContainer from '../../custom-components/IFrameCRMContainer';
import { FlexComponent } from '../../../../types/feature-loader';
import { frameStyle } from '../../custom-components/IFrameCRMContainer/IFrameWrapper/IFrameWrapperStyles';

export const componentName = FlexComponent.CRMContainer;
export const componentHook = function replaceAndSetCustomCRMContainer(flex: typeof Flex, _manager: Flex.Manager) {
  const baseUrl = 'https://www.bing.com';
  flex.CRMContainer.Content.replace(<IFrameCRMContainer key="custom-crm-container" baseUrl={baseUrl} />, {
    sortOrder: 1,
    if: (props) => {
      return props.task !== undefined;
    },
  });

  flex.CRMContainer.Content.replace(
    <iframe key="custom-crm-container" src={displayUrlWhenNoTasks()} style={frameStyle} />,
    {
      sortOrder: 1,
      if: (props) => {
        return shouldDisplayUrlWhenNoTasks() && props.task === undefined;
      },
    },
  );
};
