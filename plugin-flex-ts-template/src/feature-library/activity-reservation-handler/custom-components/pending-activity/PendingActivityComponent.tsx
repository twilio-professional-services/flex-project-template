import { useState, useEffect } from 'react';

import { Activity, Container, Title } from './PendingActivityStyles';
import FlexState from '../../flex-hooks/states/FlexState';

function PendingActivityComponent() {
  const [pendingActivity, setPendingActivity] = useState<any | undefined>(undefined);

  useEffect(() => {
    const activityCheckInterval = setInterval(() => {
      const pendingActivityFlexState = FlexState.pendingActivity;
      if (pendingActivityFlexState?.sid !== pendingActivity?.sid) {
        setPendingActivity({ pendingActivityFlexState });
      }
    }, 1000);
    return () => clearInterval(activityCheckInterval);
  }, []);

  return pendingActivity && pendingActivity.isUserSelected ? (
    <Container>
      <Title>Pending Activity</Title>
      <Activity>{pendingActivity.name}</Activity>
    </Container>
  ) : null;
}

export default PendingActivityComponent;
