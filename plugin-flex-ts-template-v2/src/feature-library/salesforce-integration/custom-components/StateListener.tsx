import { useFlexSelector } from '@twilio/flex-ui';
import { useEffect } from 'react';

import AppState from '../../../types/manager/AppState';
import { updateUtilityBar } from '../utils/UtilityBarHelper';

const StateListener = () => {
  const { activity, tasks } = useFlexSelector((state: AppState) => state.flex.worker);

  useEffect(() => {
    updateUtilityBar(activity, tasks);
  }, [activity, tasks]);

  return null;
};

export default StateListener;
