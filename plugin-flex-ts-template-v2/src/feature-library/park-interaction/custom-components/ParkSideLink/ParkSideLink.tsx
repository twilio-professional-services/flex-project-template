import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings';

interface OwnProps {
  activeView?: string;
  viewName: string;
}

const ParkSideLink = (props: OwnProps) => {
  const ParkInteraction = Manager.getInstance().strings as any;

  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  }

  return (
    <SideLink
      showLabel={true}
      icon="UnorderedList"
      iconActive="UnorderedList"
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="park-interaction-side-link"
    >
      {ParkInteraction[StringTemplates.ParkedInteractions]}
    </SideLink>
  );
};

export default ParkSideLink;
