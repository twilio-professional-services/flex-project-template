import React from 'react';
import { Actions } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';

interface AdminHookProps {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
}

const MassWorkerUpdateAdmin = (props: AdminHookProps) => {
  if (!props.initialConfig?.enabled) return <></>;

  const navigate = () => {
    Actions.invokeAction('NavigateToView', { viewName: 'mass-worker-update' });
  };

  return (
    <Button variant="secondary" onClick={navigate}>
      Open Mass Worker Update
    </Button>
  );
};

export const adminHook = function addMassWorkerUpdateAdmin(payload: any) {
  if (payload.feature !== 'mass_worker_update') return;
  payload.component = <MassWorkerUpdateAdmin {...payload} />;
};
