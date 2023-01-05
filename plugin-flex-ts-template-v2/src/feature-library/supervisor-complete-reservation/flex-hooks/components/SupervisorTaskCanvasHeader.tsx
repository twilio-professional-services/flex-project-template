import React from 'react';
import * as Flex from '@twilio/flex-ui';
import SupervisorCompleteReservation from '../../custom-components/SupervisorCompleteReservation'
import { isFeatureEnabled } from '../..';

export function addUpdateReservationToSupervisorTaskCanvasHeader(flex: typeof Flex) {

  if(!isFeatureEnabled()) return;

    flex.Supervisor.TaskCanvasHeader.Content.add(<SupervisorCompleteReservation key="supervisor-complete-reservation"/>,
        {  sortOrder: 3, align: "end" }
    );
}
