import React from 'react';
import { Actions, Template, templates } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core';

import { StringTemplates } from '../../flex-hooks/strings/ScheduleManager';

const ScheduleAdmin = () => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: 'schedule-manager' });
  }

  return (
    <Button variant="secondary" onClick={navigate}>
      <Template source={templates[StringTemplates.OPEN_SCHEDULE_MANAGER]} />
    </Button>
  );
};

export default ScheduleAdmin;
