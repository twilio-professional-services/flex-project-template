import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { canShowAdminUi } from '../../utils/helpers';
import PostCallSurveyView from '../../custom-components/PostCallSurveyView/PostCallSurveyView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addAdminView(flex: typeof Flex, manager: Flex.Manager) {
  if (!canShowAdminUi(manager)) {
    return;
  }

  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="post-call-survey" key="pcs-admin-view">
      <PostCallSurveyView key="pcs-admin-view-content" />
    </flex.View>,
  );
};
