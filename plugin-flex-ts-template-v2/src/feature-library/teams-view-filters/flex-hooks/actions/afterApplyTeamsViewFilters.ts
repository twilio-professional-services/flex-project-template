import * as Flex from '@twilio/flex-ui';
import { AppliedFilter } from '@twilio/flex-ui/src/state/Supervisor/SupervisorState.definitions';

import { shouldLogFilters } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export interface ApplyTeamsViewFiltersPayload {
  extraFilterQuery?: string;
  filters: Array<AppliedFilter>;
}

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.ApplyTeamsViewFilters;
export const actionHook = function logApplyListFilters(flex: typeof Flex, _manager: Flex.Manager) {
  if (!shouldLogFilters()) return;

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    console.log('Team view filters applied', payload);
  });
};
