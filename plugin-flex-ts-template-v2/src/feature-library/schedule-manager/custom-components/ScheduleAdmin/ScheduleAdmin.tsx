import React from 'react';
import { Actions } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';

interface OwnProps {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
}

const ScheduleAdmin = (props: OwnProps) => {
  if (!props.initialConfig.enabled) {
    // Only show the button if the feature is enabled
    return <></>;
  }

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
