import React from 'react';
import * as Flex from '@twilio/flex-ui';
import SupervisorCompleteReservation from '../../custom-components/SupervisorCompleteReservation'
import { isFeatureEnabled, isSupervisorBargeCoachEnabled } from '../..';

export function addUpdateReservationToSupervisorTaskCanvas(flex: typeof Flex) {

  if(!isFeatureEnabled() || isSupervisorBargeCoachEnabled()) return;

    flex.Supervisor.TaskOverviewCanvas.Content.add(<SupervisorCompleteReservation key="supervisor-complete-reservation"/>,
        {  sortOrder: 0, align: "start" }
    );
}
