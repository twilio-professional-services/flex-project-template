import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings';

interface OwnProps {
  activeView?: string;
  viewName: string;
}

const AdminSideLink = (props: OwnProps) => {
  const AdminStrings = Manager.getInstance().strings as any;

  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Settings"
      iconActive="SettingsBold"
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="template-admin-side-link"
    >
      {AdminStrings[StringTemplates.ADMIN_TITLE]}
    </SideLink>
  );
};

export default AdminSideLink;
