import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings/MassWorkerUpdate';

interface OwnProps {
  activeView?: string;
  viewName: string;
}

const MassWorkerUpdateSideLink = (props: OwnProps) => {
  const strings = Manager.getInstance().strings as any;

  const navigate = () => {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  };

  return (
    <SideLink
      showLabel={true}
      icon="GenericTaskBold"
      iconActive="GenericTask"
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="mass-worker-update-side-link"
    >
      {strings[StringTemplates.SIDE_LINK]}
    </SideLink>
  );
};

export default MassWorkerUpdateSideLink;
