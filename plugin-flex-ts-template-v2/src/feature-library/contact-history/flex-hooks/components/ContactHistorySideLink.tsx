import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

interface OwnProps {
  activeView?: string;
  viewName: string;
}

const ContactHistorySideLink = (props: OwnProps) => {
  const AllStrings = Manager.getInstance().strings as any;

  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Directory"
      iconActive="DirectoryBold"
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="contact-history-side-link"
    >
      {AllStrings[StringTemplates.ContactHistory]}
    </SideLink>
  );
};

export default ContactHistorySideLink;
