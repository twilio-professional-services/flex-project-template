import React from 'react';
import * as Flex from '@twilio/flex-ui';

import SupervisorCompleteReservation from '../../custom-components/SupervisorCompleteReservation';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addUpdateReservationToSupervisorTaskCanvasHeader(flex: typeof Flex) {
  flex.Supervisor.TaskCanvasHeader.Content.add(
    <SupervisorCompleteReservation key="supervisor-complete-reservation" />,
    { sortOrder: 3, align: 'end' },
  );
};
