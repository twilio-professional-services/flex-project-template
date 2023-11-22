import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings';

interface OwnProps {
  activeView?: string;
  viewName: string;
}

const SupervisorBroadcastSideLink = (props: OwnProps) => {
  const Strings = Manager.getInstance().strings as any;

  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  }

  return (
    <SideLink
      showLabel={true}
      icon="AgentIcon"
      iconActive="AgentIconBold"
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="template-admin-side-link"
    >
      {Strings[StringTemplates.BROADCAST_SIDELINK]}
    </SideLink>
  );
};

export default SupervisorBroadcastSideLink;
