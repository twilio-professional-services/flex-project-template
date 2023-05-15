import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings/ScheduleManager';

interface OwnProps {
  activeView?: string;
  viewName: string;
}

const ScheduleSideLink = (props: OwnProps) => {
  const ScheduleManagerStrings = Manager.getInstance().strings as any;

  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Clock"
      iconActive="Clock"
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="schedule-manager-side-link"
    >
      {ScheduleManagerStrings[StringTemplates.SCHEDULE_MANAGER_TITLE]}
    </SideLink>
  );
};

export default ScheduleSideLink;
