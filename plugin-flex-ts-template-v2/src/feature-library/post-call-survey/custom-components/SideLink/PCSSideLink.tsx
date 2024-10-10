import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';
import { ProductContactCenterAssessmentsIcon } from '@twilio-paste/icons/esm/ProductContactCenterAssessmentsIcon';

import { StringTemplates } from '../../flex-hooks/strings';
import { PCRIconBold } from '../Icons/PCRIconBold';

interface PCSSideLinkProps {
  activeView?: string;
  viewName: string;
}

const PCSSideLink = (props: PCSSideLinkProps) => {
  const PostCallSurveyStrings = Manager.getInstance().strings as any;

  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  }

  return (
    <SideLink
      showLabel={true}
      icon={
        <ProductContactCenterAssessmentsIcon decorative={true} title={PostCallSurveyStrings[StringTemplates.TITLE]} />
      }
      iconActive={<PCRIconBold />}
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="pcr-side-link"
    >
      {PostCallSurveyStrings[StringTemplates.TITLE]}
    </SideLink>
  );
};

export default PCSSideLink;
