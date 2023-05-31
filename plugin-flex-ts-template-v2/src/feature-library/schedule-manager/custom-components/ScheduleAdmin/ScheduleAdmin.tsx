import React from 'react';
import { Actions } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core';

const ScheduleAdmin = () => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: 'schedule-manager' });
  }

  return (
    <Button variant="secondary" onClick={navigate}>
      Open Schedule Manager
    </Button>
  );
};

export default ScheduleAdmin;
